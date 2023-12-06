import { Op } from "sequelize";
import { IApplication, ICareer, IQueryParams, IResume } from "../shared/interfaces";
import db from "../models";
import { validate } from "uuid";
import { formatCurrency } from "../utils/formatter";

export class CareerService {
  // Careers
  static async createCareer(createdById: string, careerData: ICareer) {
    const {
      title,
      description,
      department,
      employmentType,
      benefits,
      responsibilities,
      qualifications,
      company,
      startingAt,
      compensationType,
    } = careerData;

    if (
      !title ||
      !description ||
      !department ||
      !employmentType ||
      !benefits ||
      !responsibilities ||
      !qualifications ||
      !company ||
      !startingAt ||
      !compensationType
    ) {
      throw new Error("Missing required fields");
    }
    const existingCareer = await db.Career.findOne({
      where: { title: title },
    });

    if (existingCareer) {
      throw new Error(`Career with the title ${title} already exists`);
    }

    const career = await db.Career.create({
      ...careerData,
      startingAt: formatCurrency(parseInt(startingAt)),
      createdBy: createdById,
      updatedBy: createdById,
    });

    return career;
  }

  static async getCareers(params: IQueryParams) {
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

    const careers = await db.Career.findAll({
      where: whereClause,
      order: orderClause.length > 0 ? orderClause : undefined,
      limit,
      offset,
      attributes,
    });

    const careerCount = careers.length;

    if (careerCount === 0) {
      throw new Error("No careers found");
    }

    return {
      careers: careers,
      count: careerCount,
    };
  }

  static async getCareer(careerId: string) {
    if (careerId === null || careerId === undefined) {
      throw new Error("Career ID is required and cannot be null or undefined.");
    }

    if (!validate(careerId)) {
      throw new Error("Career ID format is invalid. Please provide a correctly formatted ID.");
    }

    const career = await db.Career.findByPk(careerId);

    if (career === null) {
      throw new Error("Career not found for the provided ID.");
    }

    return career;
  }

  static async updateCareer(careerId: string) {}

  static async deleteCareer(careerId: string) {
    if (careerId === null || careerId === undefined) {
      throw new Error("Career ID is required and cannot be null or undefined.");
    }

    if (!validate(careerId)) {
      throw new Error("Career ID format is invalid. Please provide a correctly formatted ID.");
    }

    const career = await db.Career.findByPk(careerId);

    if (career === null) {
      throw new Error("Career not found for the provided ID.");
    }

    await career.destroy();
  }

  // Applications
  static async createApplication(careerId: string, applicationData: IApplication) {
    const career = await db.Career.findByPk(careerId);

    if (!validate(careerId)) {
      throw new Error("Invalid job listing ID");
    }

    if (career === null) {
      throw new Error("Career does not exist");
    }

    const { applicant } = applicationData;

    const requiredFields = ["firstName", "lastName", "email", "phoneNumber", "resume", "answers"] as const;

    requiredFields.forEach((field) => {
      if (!applicant[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    });

    const existingApplication = await db.Application.findOne({
      where: {
        [Op.or]: [
          db.sequelize.literal(`applicant->>"$.phoneNumber" = '${applicant.phoneNumber}'`),
          db.sequelize.literal(`applicant->>"$.email" = '${applicant.email}'`),
        ],
        careerId: careerId,
      },
    });

    if (existingApplication) {
      throw new Error(
        `Career application with the email ${applicant.email} or phone number ${applicant.phoneNumber} already exists for this listing`
      );
    }

    const transaction = await db.sequelize.transaction();

    const application = await db.Application.create(
      {
        ...applicationData,
        careerId: careerId,
      },
      { transaction }
    );

    await career.increment("applicantCount", { by: 1, transaction });

    await transaction.commit();

    return application;
  }

  static async getApplications(params: IQueryParams) {
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

    const applications = await db.Application.findAll({
      include: [
        {
          model: db.Career,
          as: "career",
          attributes: ["title"],
        },
      ],
      where: whereClause,
      order: orderClause.length > 0 ? orderClause : undefined,
      limit,
      offset,
      attributes,
    });

    const applicationCount = applications.length;

    return { applications: applications, count: applicationCount };
  }

  static async getApplication(applicationId: string) {
    if (applicationId === null || applicationId === undefined) {
      throw new Error("Application ID is required and cannot be null or undefined.");
    }

    if (!validate(applicationId)) {
      throw new Error("Application ID format is invalid. Please provide a correctly formatted ID.");
    }

    const application = await db.Application.findByPk(applicationId);

    if (application === null) {
      throw new Error("Application not found for the provided ID.");
    }

    return application;
  }

  static async updateApplication(applicationId: string) {}

  static async deleteApplication(applicationId: string) {
    if (applicationId === null || applicationId === undefined) {
      throw new Error("Application ID is required and cannot be null or undefined.");
    }

    if (!validate(applicationId)) {
      throw new Error("Application ID format is invalid. Please provide a correctly formatted ID.");
    }

    const application = await db.Application.findByPk(applicationId);

    if (application === null) {
      throw new Error("Application not found for the provided ID.");
    }

    await application.destroy();
  }

  // Resumes
  static async createResume(s3Ref: string, resumeData: IResume) {
    const { firstName, lastName, email, phone } = resumeData;

    if (!firstName || !lastName || !email || !phone) {
      throw new Error("Missing required fields");
    }

    const resume = await db.Resume.create({
      ...resumeData,
      s3Ref: s3Ref,
    });

    return resume;
  }

  static async getResumes(params: IQueryParams) {
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

    const resumes = await db.Resume.findAll({
      where: whereClause,
      order: orderClause.length > 0 ? orderClause : undefined,
      limit,
      offset,
      attributes,
    });

    const resumeCount = resumes.length;

    if (resumes === 0) {
      throw new Error("No resumes found");
    }

    return {
      resumes: resumes,
      count: resumeCount,
    };
  }

  static async getResume(resumeId: string) {
    if (resumeId === null || resumeId === undefined) {
      throw new Error("Resume ID is required and cannot be null or undefined.");
    }

    if (!validate(resumeId)) {
      throw new Error("Resume ID format is invalid. Please provide a correctly formatted ID.");
    }

    const resume = await db.Resume.findByPk(resumeId);

    if (resume === null) {
      throw new Error("Resume not found for the provided ID.");
    }

    return resume;
  }

  static async updateResume(resumeId: string) {}

  static async deleteResume(resumeId: string) {
    if (resumeId === null || resumeId === undefined) {
      throw new Error("Resume ID is required and cannot be null or undefined.");
    }

    if (!validate(resumeId)) {
      throw new Error("Resume ID format is invalid. Please provide a correctly formatted ID.");
    }

    const resume = await db.Resume.findByPk(resumeId);

    if (resume === null) {
      throw new Error("Resume not found for the provided ID.");
    }

    await resume.destroy();
  }
}
