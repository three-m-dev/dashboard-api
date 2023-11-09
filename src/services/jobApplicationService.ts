import { IJobApplication, IJobApplicationDirectory } from '../interfaces/ICommon';
import db from '../models';
import { validate } from 'uuid';

export class JobApplicationService {
	static async createJobApplication(jobListingId: string, applicantData: IJobApplication): Promise<IJobApplication> {
		if (!validate(jobListingId)) {
			throw new Error('Invalid job listing ID');
		}

		if (!applicantData?.applicant) {
			throw new Error('Missing required field: applicant');
		}

		const transaction = await db.sequelize.transaction();

		const jobApplication = await db.JobApplication.create(
			{
				...applicantData,
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
}
