import { Op } from 'sequelize';
import { parse, format } from 'date-fns';
import db from '../models';
import { IDowntimeEntry, IDowntimeReport, IQueryParams } from '../shared/interfaces';

export class DowntimeService {
  public async createdDowntimeEntry(currentUserId: string, downtimeData: IDowntimeEntry) {
    const currentUser = await db.Employee.findOne({ where: { userId: currentUserId } });

    if (!currentUser) {
      throw new Error('Current user not found');
    }

    if (!downtimeData.date) {
      throw new Error('Date is required');
    }

    if (!downtimeData.operatorId) {
      throw new Error('Operator is required');
    }

    const dateObject = parse(downtimeData.date, 'MM/dd/yyyy', new Date());

    const formattedDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.sssXXX");

    const existingEntry = await db.DowntimeEntry.findOne({
      where: {
        date: formattedDate,
        operatorId: downtimeData.operatorId,
      },
    });

    if (existingEntry) {
      throw new Error('Operator already has an entry for the selected date');
    }

    const downtimeEntry = await db.DowntimeEntry.create({
      ...downtimeData,
      date: formattedDate,
      createdBy: currentUser.id,
    });

    return downtimeEntry;
  }

  public async getDowntimeEntries(params: IQueryParams) {
    const { filter, sort, page, pageSize, fields } = params;

    let whereClause: any = {};
    let orderClause: [string, string][] = [];
    let limit = pageSize;
    let offset = page && pageSize ? (page - 1) * pageSize : 0;
    let attributes: string[] | undefined = fields;

    if (sort) {
      const [field, order] = sort.split(',');
      orderClause.push([field, order.toUpperCase()]);
    }

    if (filter?.dateRange) {
      const dateFormat = 'MM/dd/yyyy';
      if (filter.dateRange.start && filter.dateRange.end) {
        whereClause.date = {
          [Op.between]: [
            format(parse(filter.dateRange.start, dateFormat, new Date()), 'yyyy-MM-dd HH:mm:ss'),
            format(parse(filter.dateRange.end, dateFormat, new Date()), 'yyyy-MM-dd HH:mm:ss'),
          ],
        };
      } else if (filter.dateRange.end) {
        whereClause.date = {
          [Op.eq]: format(parse(filter.dateRange.end, dateFormat, new Date()), 'yyyy-MM-dd HH:mm:ss'),
        };
      }
    }

    if (filter?.operatorId) {
      whereClause.operatorId = filter.operatorId;
    }

    const downtimeEntries = await db.DowntimeEntry.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes,
    });

    const total = await db.DowntimeEntry.count({
      where: whereClause,
    });

    const pages = limit ? Math.ceil(total / limit) : 0;

    return { downtimeEntries, total, pages };
  }

  public async getDowntimeEntry(downtimeEntryId: string) {
    const downtimeEntry = await db.DowntimeEntry.findOne({ where: { id: downtimeEntryId } });

    if (!downtimeEntry) {
      throw new Error('Downtime entry not found');
    }

    return downtimeEntry;
  }

  public async updateDowntimeEntry() {}

  public async deleteDowntimeEntry() {}

  public async generateDowntimeReport(params: IQueryParams) {
    const { filter } = params;

    let whereClause: { [key: string]: any } = {};

    if (filter?.dateRange) {
      const dateFormat = 'MM/dd/yyyy';
      if (filter.dateRange.start && filter.dateRange.end) {
        whereClause.date = {
          [Op.between]: [
            format(parse(filter.dateRange.start, dateFormat, new Date()), 'yyyy-MM-dd HH:mm:ss'),
            format(parse(filter.dateRange.end, dateFormat, new Date()), 'yyyy-MM-dd HH:mm:ss'),
          ],
        };
      } else if (filter.dateRange.start) {
        whereClause.date = {
          [Op.gte]: format(parse(filter.dateRange.start, dateFormat, new Date()), 'yyyy-MM-dd HH:mm:ss'),
        };
      } else if (filter.dateRange.end) {
        whereClause.date = {
          [Op.lte]: format(parse(filter.dateRange.end, dateFormat, new Date()), 'yyyy-MM-dd HH:mm:ss'),
        };
      }
    }

    if (filter?.operatorId) {
      whereClause.operatorId = filter.operatorId;
    }

    const downtimeEntries: IDowntimeEntry[] = await db.DowntimeEntry.findAll({
      where: whereClause,
      order: [['date', 'ASC']],
    });

    const aggregatedDowntime: { [key: string]: IDowntimeReport } = {};

    for (const entry of downtimeEntries) {
      const entryDate = new Date(entry.date);
      const dayOffset = 7 - entryDate.getDay();
      const weekEnd = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate() + dayOffset);
      const weekOfKey = format(weekEnd, 'MM/dd/yyyy');

      if (!aggregatedDowntime[weekOfKey]) {
        aggregatedDowntime[weekOfKey] = {
          totalDowntime: 0,
          downtime: {},
        };
      }

      const report = aggregatedDowntime[weekOfKey];

      if (entry.downtime && typeof entry.downtime === 'object') {
        for (const [reason, duration] of Object.entries(entry.downtime)) {
          if (typeof duration === 'number') {
            report.downtime[reason] = (report.downtime[reason] || 0) + duration;
            report.totalDowntime += duration;
          } else if (typeof duration === 'object') {
            for (const [subReason, subDuration] of Object.entries(duration)) {
              if (typeof subDuration === 'number') {
                report.downtime[subReason] = (report.downtime[subReason] || 0) + subDuration;
                report.totalDowntime += subDuration;
              } else {
                console.error(`Invalid sub-duration type for reason ${subReason}:`, subDuration);
              }
            }
          } else {
            console.error(`Invalid duration type for reason ${reason}:`, duration);
          }
        }
      } else {
        console.error('Invalid or missing downtime data in entry:', entry);
      }
    }

    return aggregatedDowntime;
  }
}
