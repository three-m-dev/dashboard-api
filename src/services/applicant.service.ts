import { IApplicant, IQueryParams } from '../interfaces';
import db from '../models';

export class ApplicantService {
  public createApplicant = async (applicantData: IApplicant) => {};

  public getApplicants = async (params: IQueryParams) => {
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

    const applicants = await db.Applicant.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes,
    });

    const total = await db.Applicant.count({
      where: whereClause,
    });

    const pages = limit ? Math.ceil(total / limit) : 0;

    return { applicants, total, pages };
  };

  public getApplicant = async (applicantId: string) => {
    const applicant = await db.Applicant.findOne({
      where: { id: applicantId },
    });

    if (!applicant) {
      throw new Error('Applicant not found');
    }

    return applicant;
  };

  public updateApplicant = async (applicantId: string, applicantData: Partial<IApplicant>) => {};

  public deleteApplicant = async (applicantId: string) => {
    const applicant = await db.Applicant.findOne({ where: { id: applicantId } });

    if (!applicant) {
      throw new Error('Applicant not found');
    }

    await applicant.destroy();

    return;
  };
}
