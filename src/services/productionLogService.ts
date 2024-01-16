import { Op } from 'sequelize';
import { format, parse } from 'date-fns';
import db from '../models';
import { IProductionLog, IQueryParams } from '../shared/interfaces';

export class ProductionLogService {
  public async createProductionLog(currentUserId: string, productionLogData: IProductionLog) {
    const currentUser = await db.Employee.findOne({ where: { userId: currentUserId } });

    if (!currentUser) {
      throw new Error('Current user not found');
    }

    const existingProductionLog = await db.ProductionLog.findOne({
      where: {
        weekOf: productionLogData.weekOf,
      },
    });

    if (existingProductionLog) {
      throw new Error('A production log has already been created for the week selected');
    }

    const productionLog = await db.ProductionLog.create({ ...productionLogData, createdBy: currentUser.id });

    return productionLog;
  }

  public async getProductionLogs(params: IQueryParams) {
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
      const dateFormat = 'yyyy-MM-dd';
      if (filter.dateRange.start && filter.dateRange.end) {
        const startDate = parse(filter.dateRange.start, dateFormat, new Date());
        const endDate = parse(filter.dateRange.end, dateFormat, new Date());

        endDate.setHours(23, 59, 59, 999);

        whereClause.weekOf = {
          [Op.between]: [format(startDate, 'yyyy-MM-dd HH:mm:ss'), format(endDate, 'yyyy-MM-dd HH:mm:ss')],
        };
      } else if (filter.dateRange.end) {
        const endDate = parse(filter.dateRange.end, dateFormat, new Date());
        endDate.setHours(23, 59, 59, 999);

        whereClause.weekOf = {
          [Op.eq]: format(endDate, 'yyyy-MM-dd HH:mm:ss'),
        };
      }
    }

    const productionLogs = await db.ProductionLog.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes,
    });

    const total = await db.ProductionLog.count({ where: whereClause });

    const pages = limit ? Math.ceil(total / limit) : 0;

    return { productionLogs, total, pages };
  }

  public async getProductionLog(productionLogId: string) {
    const productionLog = await db.ProductionLog.findOne({
      where: {
        id: productionLogId,
      },
    });

    if (!productionLog) {
      throw new Error('Production log not found');
    }

    return productionLog;
  }

  public async updateProductionLog() {}

  public async deleteProductionLog() {}
}
