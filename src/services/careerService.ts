import { Op } from 'sequelize';
import {
	ICareerApplication,
	ICareerApplicationDirectory,
	ICareerListing,
	ICareerListingDirectory,
	IResume,
} from '../interfaces/ICommon';
import db from '../models';
import { validate } from 'uuid';

export class CareerService {
	static async createCareerListing(createdById: string, data: ICareerListing): Promise<ICareerListing> {
		const { title, description } = data;

		const requiredFields = [title, description];

		requiredFields.forEach((field) => {
			if (!field) {
				throw new Error(`Missing required field ${field}`);
			}
		});

		const existingCareerListing = await db.CareerListing.findOne({
			where: { title: title },
		});

		if (existingCareerListing) {
			throw new Error(`Career listing with the title ${title} already exists`);
		}

		const careerListing = await db.CareerListing.create({
			...data,
			createdBy: createdById,
			updatedBy: createdById,
		});

		return careerListing;
	}

	static async getCareerListings(): Promise<ICareerListingDirectory> {
		const careerListings = await db.CareerListing.findAll({
			order: [['createdAt', 'DESC']],
		});

		const careerListingCount = careerListings.length;

		if (careerListingCount === 0) {
			throw new Error('No job listings found');
		}

		return {
			careerListings: careerListings,
			count: careerListingCount,
		};
	}

	static async getCareerListingById(careerListingId: string): Promise<ICareerListing> {
		if (!validate(careerListingId)) {
			throw new Error('Invalid career listing ID');
		}

		const careerListing = await db.CareerListing.findByPk(careerListingId);

		if (careerListing === null) {
			throw new Error('Career listing does not exist');
		}

		return careerListing;
	}

	static async createCareerApplication(careerListingId: string, data: ICareerApplication): Promise<ICareerApplication> {
		const careerListing = await db.CareerListing.findByPk(careerListingId);

		if (!validate(careerListingId)) {
			throw new Error('Invalid job listing ID');
		}

		if (careerListing === null) {
			throw new Error('Career listing does not exist');
		}

		const { applicant } = data;

		const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber', 'resume', 'answers'] as const;

		requiredFields.forEach((field) => {
			if (!applicant[field]) {
				throw new Error(`Missing required field: ${field}`);
			}
		});

		const existingPhoneNumber = db.sequelize.literal(`"applicant"->>'phoneNumber' = :existingPhoneNumber`);
		const existingEmail = db.sequelize.literal(`"applicant"->>'email' = :existingEmail`);

		const existingCareerApplication = await db.CareerApplication.findOne({
			where: {
				[Op.or]: [existingPhoneNumber, existingEmail],
				careerListingId: careerListingId,
			},
			replacements: {
				existingPhoneNumber: applicant.phoneNumber,
				existingEmail: applicant.email,
			},
		});

		if (existingCareerApplication) {
			throw new Error(
				`Career application with the email ${applicant.email} or phone number ${applicant.phoneNumber} already exists for this listing`
			);
		}

		const transaction = await db.sequelize.transaction();

		const careerApplication = await db.CareerApplication.create(
			{
				...data,
				careerListingId: careerListingId,
			},
			{ transaction }
		);

		await careerListing.increment('applicantCount', { by: 1, transaction });

		await transaction.commit();

		return careerApplication;
	}

	static async getCareerApplications(): Promise<ICareerApplicationDirectory> {
		const careerApplications = await db.CareerApplication.findAll();

		const careerApplicationCount = careerApplications.length;

		if (careerApplicationCount === 0) {
			throw new Error('No career applications found');
		}

		return { careerApplications: careerApplications, count: careerApplicationCount };
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
