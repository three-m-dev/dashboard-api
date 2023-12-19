import { Op } from 'sequelize';
import { parse, format } from 'date-fns';
import db from '../models';
import { IDowntimeEntry, IDowntimeFilter, IQueryParams } from '../shared/interfaces';

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
        date: downtimeData.date,
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

    // Check if filter contains a dateRange
    if (filter?.dateRange) {
      if (filter.dateRange.start && filter.dateRange.end) {
        whereClause.date = {
          [Op.between]: [filter.dateRange.start, filter.dateRange.end],
        };
      } else if (filter.dateRange.end) {
        // Filter for a specific day
        whereClause.date = {
          [Op.eq]: filter.dateRange.end,
        };
      }
    }

    // Check if filter contains an operatorId
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

  public async getDowntimeEntry() {}

  public async updateDowntimeEntry() {}

  public async deleteDowntimeEntry() {}

  public async generateDowntimeReport(filter: IDowntimeFilter) {
    let whereClause: any = {};

    if (filter) {
      if (filter.dateRange && filter.dateRange.start) {
        const startDate = parse(filter.dateRange.start, "yyyy-MM-dd'T'HH:mm:ss.sssX", new Date());
        whereClause.date = {
          [Op.gte]: startDate,
        };

        if (filter.dateRange.end) {
          const endDate = parse(filter.dateRange.end, "yyyy-MM-dd'T'HH:mm:ss.sssX", new Date());
          whereClause.date[Op.lte] = endDate;
        }
      }

      if (filter.operatorId) {
        whereClause.operatorId = filter.operatorId;
      }
    } else {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      whereClause.date = {
        [Op.between]: [ninetyDaysAgo, new Date()],
      };
    }

    const downtime = await db.DowntimeEntry.findAll({
      where: whereClause,
    });

    return downtime;
  }
}
