import { ICareer, IQueryParams } from '../interfaces';
import db from '../models';

export class CareerService {
  public createCareer = async (careerData: ICareer) => {};

  public getCareers = async (params: IQueryParams) => {
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

    const careers = await db.Career.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes,
    });

    const total = await db.Career.count({
      where: whereClause,
    });

    const pages = limit ? Math.ceil(total / limit) : 0;

    return { careers, total, pages };
  };

  public getCareer = async (careerId: string) => {
    const career = await db.Career.findOne({
      where: { id: careerId },
    });

    if (!career) {
      throw new Error('Career not found');
    }

    return career;
  };

  public updateCareer = async (careerId: string, careerData: Partial<ICareer>) => {};

  public deleteCareer = async (careerId: string) => {
    const career = await db.Career.findOne({ where: { id: careerId } });

    if (!career) {
      throw new Error('Career not found');
    }

    await career.destroy();

    return;
  };
}
