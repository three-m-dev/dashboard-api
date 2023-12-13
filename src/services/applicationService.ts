import { Op } from 'sequelize';
import db from '../models';
import { IApplication, IApplicant, IQueryParams } from '../shared/interfaces';
import { ApplicantService } from './applicantService';

export class ApplicationService {
  private applicantService: ApplicantService;

  constructor() {
    this.applicantService = new ApplicantService();
  }

  public async createApplication(applicantData: IApplicant, applicationData: IApplication) {
    const t = await db.sequelize.transaction();

    try {
      const applicantParams: IQueryParams = {
        filter: {
          [Op.or]: [{ email: applicantData.email }, { phone: applicantData.phone }],
        },
      };

      const { applicants: existingApplicants } = await this.applicantService.getApplicants(applicantParams, t);

      let applicant;

      if (existingApplicants && existingApplicants.length > 0) {
        applicant = existingApplicants[0];
      } else {
        applicant = await this.applicantService.createApplicant(applicantData, t);
      }

      const existingApplication = await db.Application.findOne({
        where: {
          [Op.and]: [{ applicantId: applicant.id }, { jobId: applicationData.jobId }],
        },
        transaction: t,
      });

      if (existingApplication) {
        throw new Error('An application has already been submitted for this job by the current applicant');
      }

      const application = await db.Application.create(
        { ...applicationData, applicantId: applicant.id },
        { transaction: t }
      );

      await t.commit();
      return { applicant, application };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
