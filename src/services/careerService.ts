import { IJobListing, IJobListingDirectory, IResume } from '../interfaces/ICommon';
import { IJobApplication, IJobApplicationDirectory } from '../interfaces/ICommon';
import db from '../models';
import { validate } from 'uuid';

export class CareerService {
	static async createJobListing(createdById: string, data: IJobListing): Promise<IJobListing> {
		const requiredFields = ['title', 'description'] as const;

		const missingField = requiredFields.find((field) => !data[field]);

		if (missingField) {
			throw new Error(`Missing required field: ${missingField}`);
		}

		const jobListing = await db.JobListing.create({
			...data,
			createdBy: createdById,
			updatedBy: createdById,
		});

		return jobListing;
	}

	static async getJobListings(): Promise<IJobListingDirectory> {
		const jobListings = await db.JobListing.findAll({
			order: [['createdAt', 'DESC']],
		});

		const jobListingCount = jobListings.length;

		if (jobListings.length === 0) {
			throw new Error('No job listings found');
		}

		return {
			jobListings: jobListings,
			count: jobListingCount,
		};
	}

	static async getJobListingById(jobListingId: string): Promise<IJobListing> {
		if (jobListingId === null) {
			throw new Error('Invalid search criteria');
		}

		const jobListing = await db.JobListing.findByPk(jobListingId);

		if (jobListing === null) {
			throw new Error('No job listing found');
		}

		return jobListing;
	}

	static async createJobApplication(jobListingId: string, data: IJobApplication): Promise<IJobApplication> {
		if (!validate(jobListingId)) {
			throw new Error('Invalid job listing ID');
		}

		if (!data?.applicant) {
			throw new Error('Missing required field: applicant');
		}

		const transaction = await db.sequelize.transaction();

		const jobApplication = await db.JobApplication.create(
			{
				...data,
				jobListingId: jobListingId,
			},
			{ transaction }
		);

		const jobListing = await db.JobListing.findByPk(jobListingId);

		if (jobListing === null) {
			throw new Error('Job listing does not exist');
		}

		await jobListing.increment('applicantCount', { by: 1, transaction });

		await transaction.commit();

		return jobApplication;
	}

	static async getJobApplications(): Promise<IJobApplicationDirectory> {
		const jobApplications = await db.JobApplication.findAll();

		return { jobApplications, count: jobApplications.length };
	}

	static async createResume(s3Ref: string, data: IResume): Promise<IResume> {
		const requiredFields = ['firstName', 'lastName', 'email', 'phone'] as const;

		const missingField = requiredFields.find((field) => !data[field]);

		if (missingField) {
			throw new Error(`Missing required field: ${missingField}`);
		}
		const resume = await db.Resume.create({
			...data,
			s3Ref: s3Ref,
		});

		return resume;
	}
}
