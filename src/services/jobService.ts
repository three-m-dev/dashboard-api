import db from '../models';
import { IJob, IQueryParams } from '../shared/interfaces';

export class JobService {
  public async createJob(currentUserId: string, jobData: IJob) {
    const currentUser = await db.Employee.findOne({ where: { userId: currentUserId } });

    if (!currentUser) {
      throw new Error('Current user not found');
    }

    if (!jobData.companyId) {
      throw new Error('Company is required');
    }

    if (!jobData.departmentId) {
      throw new Error('Department is required');
    }

    if (!jobData.title) {
      throw new Error('Title is required');
    }

    const existingJob = await db.Job.findOne({ where: { title: jobData.title } });

    if (existingJob) {
      throw new Error('Job already exists');
    }

    if (!jobData.description) {
      throw new Error('Description is required');
    }

    if (!jobData.location) {
      throw new Error('Location is required');
    }

    if (!jobData.type) {
      throw new Error('Type is required');
    }

    if (!jobData.status) {
      throw new Error('Status is required');
    }

    if (!jobData.salary && !jobData.wage) {
      throw new Error('Salary or wage is required');
    }

    if (!jobData.positionsOpen) {
      throw new Error('Positions open is required');
    }

    const job = await db.Job.create({
      ...jobData,
      createdBy: currentUser.id,
    });

    return job;
  }

  public async getJobs(params: IQueryParams) {
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

    if (page && pageSize) {
      limit = pageSize;
      offset = (page - 1) * pageSize;
    }

    const jobs = await db.Job.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      attributes,
    });

    const total = await db.Job.count({ where: whereClause });

    const pages = limit ? Math.ceil(total / limit) : 0;

    return { jobs, total, pages };
  }

  public async getJob(jobId: string) {
    const job = await db.Job.findOne({ where: { id: jobId } });

    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  public async updateJob(jobId: string, updates: Partial<IJob>) {
    const restrictedFields = ['id', 'companyId', 'createdAt', 'createdBy'];

    for (const field of restrictedFields) {
      if (updates[field as keyof IJob] !== undefined) {
        throw new Error(`Field '${field}' cannot be updated`);
      }
    }

    const job = await db.Job.findOne({ where: { id: jobId } });

    if (!job) {
      throw new Error('Job not found');
    }

    Object.assign(job, updates);

    await job.save();

    return { job };
  }

  public async deleteJob(jobId: string) {
    const job = await db.Job.findOne({ where: { jobId } });

    if (!job) {
      throw new Error('Job not found');
    }

    await job.destroy();

    return;
  }
}
