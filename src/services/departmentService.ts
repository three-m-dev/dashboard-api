import { Op } from 'sequelize';
import db from '../models';
import { IDepartment, IQueryParams } from '../shared/interfaces';

export class DepartmentService {
	public async createDepartment(departmentData: IDepartment) {
		const existingDepartment = await db.Department.findOne({
			where: {
				[Op.and]: [{ company: departmentData.company }, { name: departmentData.name }],
			},
		});

		if (existingDepartment) {
			throw new Error('Department already exists');
		}

		const department = await db.Department.create(departmentData);

		return department;
	}

	public async getDepartments(params: IQueryParams) {
		const { filter, sort, page, pageSize, fields } = params;

		let whereClause = filter || {};
		let orderClause: [string, string][] = [];
		let limit = pageSize;
		let offset = page && pageSize ? (page - 1) * pageSize : 0;
		let attributes: string[] | undefined = fields;

		if (sort) {
			const [field, order] = sort.split(',');
			orderClause.push([field, order.toUpperCase()]);
		}

		if (page && pageSize) {
			limit = pageSize;
			offset = (page - 1) * pageSize;
		}

		const departments = await db.Department.findAll({
			where: whereClause,
			order: orderClause,
			limit,
			offset,
			attributes,
		});

		const total = await db.Department.count({ where: whereClause });

		const pages = limit ? Math.ceil(total / limit) : 0;

		return { departments, total, pages };
	}

	public async getDepartment(id: string) {
		const department = await db.Department.findOne({ where: { id } });

		if (!department) {
			throw new Error('Department not found');
		}

		return department;
	}
}
