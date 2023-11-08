import { IJobListing, IJobListingDirectory } from "../interfaces/ICommon";
import JobListing from "../models/jobListing";

export class JobListingService {
  static async createJobListing(createdById: string, jobListingData: IJobListing): Promise<IJobListing> {
    const requiredFields = ["title", "description"] as const;

    const missingField = requiredFields.find((field) => !jobListingData[field]);

    if (missingField) {
      throw new Error(`Missing required field: ${missingField}`);
    }

    const jobListing = await JobListing.create({
      ...jobListingData,
      createdBy: createdById,
      updatedBy: createdById,
    });

    return jobListing;
  }

  static async getJobListings(): Promise<IJobListingDirectory> {
    const jobListings = await JobListing.findAll({
      order: [["createdAt", "DESC"]],
    });

    const jobListingCount = jobListings.length;

    if (jobListings.length === 0) {
      throw new Error("No job listings found");
    }

    const jobListingInfo = jobListings.map((jobListing) => ({
      jobListingId: jobListing.jobListingId,
      title: jobListing.title,
      description: jobListing.description,
      company: jobListing.company,
      location: jobListing.location,
      department: jobListing.department,
      employmentType: jobListing.employmentType,
      requirements: jobListing.requirements,
      qualifications: jobListing.qualifications,
      salaryRange: jobListing.salaryRange,
      benefits: jobListing.benefits,
      listingStatus: jobListing.listingStatus,
      createdBy: jobListing.createdBy,
      updatedBy: jobListing.updatedBy,
    }));

    return {
      jobListings: jobListingInfo,
      count: jobListingCount,
    };
  }

  static async getJobListingById(jobListingId: string): Promise<IJobListing> {
    if (jobListingId === null) {
      throw new Error("Invalid search criteria");
    }

    const jobListing = await JobListing.findByPk(jobListingId);

    if (jobListing === null) {
      throw new Error("No job listing found");
    }

    const jobListingInfo = {
      jobListingId: jobListing.jobListingId,
      title: jobListing.title,
      description: jobListing.description,
      company: jobListing.company,
      location: jobListing.location,
      department: jobListing.department,
      employmentType: jobListing.employmentType,
      requirements: jobListing.requirements,
      qualifications: jobListing.qualifications,
      salaryRange: jobListing.salaryRange,
      benefits: jobListing.benefits,
      listingStatus: jobListing.listingStatus,
      createdBy: jobListing.createdBy,
      updatedBy: jobListing.updatedBy,
    };

    return jobListingInfo;
  }
}
