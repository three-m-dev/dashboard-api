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
		let limit = pageSize;
		let offset = page && pageSize ? (page - 1) * pageSize : 0;
		let attributes: string[] | undefined = fields;

		// Fetch logs first without order
		let productionLogs = await db.ProductionLog.findAll({
			where: whereClause,
			limit,
			offset,
			attributes,
		});

		// Sort logs by 'weekOf' if no sort parameter is provided
		if (!sort) {
			productionLogs.sort((a: any, b: any) => new Date(a.weekOf).getTime() - new Date(b.weekOf).getTime());
		} else {
			// Custom sort logic if sort parameter is provided
			const [field, order] = sort.split(',');
			productionLogs.sort((a: any, b: any) => {
				if (order.toUpperCase() === 'ASC') {
					return a[field] > b[field] ? 1 : -1;
				} else {
					return a[field] < b[field] ? 1 : -1;
				}
			});
		}

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

	public async updateProductionLog(productionLogId: string, updates: Partial<IProductionLog>) {
		const restrictedFields = ['id', 'weekOf', 'createdAt', 'createdBy'];

		for (const field of restrictedFields) {
			if (updates[field as keyof IProductionLog] !== undefined) {
				throw new Error(`Field '${field}' cannot be updated`);
			}
		}

		const productionLog = await db.ProductionLog.findOne({ where: { id: productionLogId } });

		if (!productionLog) {
			throw new Error('Production log not found');
		}

		Object.assign(productionLog, updates);

		await productionLog.save();

		return { productionLog };
	}

	public async deleteProductionLog() {}
}
