import { Op } from "sequelize";
import db from "../models";
import { IQueryParams, IApplicant } from "../shared/interfaces";

export class ApplicantService {
  public async createApplicant(applicantData: IApplicant) {
    if (!applicantData.firstName) {
      throw new Error("First name is required");
    }

    if (!applicantData.lastName) {
      throw new Error("Last name is required");
    }

    if (!applicantData.email) {
      throw new Error("Email address is required");
    }

    if (!applicantData.phone) {
      throw new Error("Phone number is required");
    }

    const existingApplicant = await db.Applicant.findOne({
      where: {
        [Op.or]: [{ email: applicantData.email }, { phone: applicantData.phone }],
      },
    });

    if (existingApplicant) {
      throw new Error("Email or phone number already associated with an applicant");
    }

    if (!applicantData.resumeRef && !applicantData.resumeLink) {
      throw new Error("Resume upload and link cannot both be empty");
    }

    const applicant = await db.Applicant.create(applicantData);

    return applicant;
  }

  public async getApplicants(params: IQueryParams) {
    const { filter, sort, page, pageSize, fields } = params;

    let whereClause = filter || {};
    let orderClause: [string, string][] = [];
    let limit = pageSize;
    let offset = page && pageSize ? (page - 1) * pageSize : 0;
    let attributes: string[] | undefined = fields;

    if (sort) {
      const [field, order] = sort.split(",");
      orderClause.push([field, order.toUpperCase()]);
    }

    if (page && pageSize) {
      limit = pageSize;
      offset = (page - 1) * pageSize;
    }

    const applicants = await db.Applicant.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes,
    });

    const total = await db.Applicant.count({ where: whereClause });

    const pages = limit ? Math.ceil(total / limit) : 0;

    return { applicants, total, pages };
  }

  public async getApplicant(applicantId: string) {
    const applicant = await db.Applicant.findOne({ where: { id: applicantId } });

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    return applicant;
  }

  public async deleteApplicant(applicantId: string) {
    const applicant = await db.Applicant.findOne({ where: { id: applicantId } });

    if (!applicant) {
      throw new Error("Applicant not found");
    }

    const applications = await db.Application.findAll({ where: { applicantId: applicantId } });

    if (applications.length > 0) {
      throw new Error("Applicant is associated with 1 or more applications");
    }

    await applicant.destroy();

    return;
  }
}
