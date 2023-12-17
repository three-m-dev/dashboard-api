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

			let existingJob;

			if (applicationData.jobId !== null) {
				existingJob = await db.Job.findOne({ where: { id: applicationData.jobId } });
			}

			if (!existingJob && applicationData.jobId !== null) {
				throw new Error("Job doesn't exist for the provided ID");
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

			const newApplication = await db.Application.findOne(
				{
					where: { id: application.id },
					include: [
						{
							model: db.Applicant,
							as: 'applicant',
						},
					],
				},
				{ transaction: t }
			);

			return { application: newApplication };
		} catch (error) {
			await t.rollback();

			throw error;
		}
	}

	public async getApplications(params: IQueryParams) {
		const { filter, sort, page, pageSize, fields } = params;

		let whereClause = filter || {};
		let orderClause: any[] = [];
		let limit = pageSize;
		let offset = page && pageSize ? (page - 1) * pageSize : 0;
		let attributes: string[] | undefined = fields;

		if (sort) {
			const [field, order] = sort.split(',');
			if (field.includes('.')) {
				const [relation, relatedField] = field.split('.');
				orderClause.push([db.sequelize.literal(`\`${relation}\`.\`${relatedField}\``), order.toUpperCase()]);
			} else {
				orderClause.push([field, order.toUpperCase()]);
			}
		}

		const applications = await db.Application.findAll({
			where: whereClause,
			order: orderClause,
			limit,
			offset,
			attributes,
			include: [
				{
					model: db.Applicant,
					as: 'applicant',
				},
				{
					model: db.Job,
					as: 'job',
				},
			],
		});

		const total = await db.Application.count({
			where: whereClause,
		});

		const pages = limit ? Math.ceil(total / limit) : 0;

		return { applications, total, pages };
	}

	public async getApplication(applicationId: string) {
		const application = await db.Application.findOne({
			where: { id: applicationId },
			include: [
				{
					model: db.Applicant,
					as: 'applicant',
				},
			],
		});

		if (!application) {
			throw new Error('Application not found');
		}

		return application;
	}

	public async updateApplication(applicationId: string, updates: Partial<IApplication>) {
		const restrictedFields = ['id', 'jobId', 'applicantId', 'createdAt', 'updatedAt'];

		for (const field of restrictedFields) {
			if (updates[field as keyof IApplication] !== undefined) {
				throw new Error(`Field '${field}' cannot be updated`);
			}
		}

		const application = await db.Application.findOne({ where: { id: applicationId } });

		if (!application) {
			throw new Error('Application not found');
		}

		Object.assign(application, updates);

		await application.save();

		return application;
	}

	public async deleteApplication(applicationId: string) {
		const application = await db.Application.findOne({ where: { id: applicationId } });

		if (!application) {
			throw new Error('Application not found');
		}

		await application.destroy();

		return;
	}
}
