import { Request, Response } from 'express';
import { JobService } from '../services/jobService';
import { IQueryParams } from '../shared/interfaces';
import { ExtendedRequest } from '../middleware/auth';

export class JobController {
	public async createJob(req: ExtendedRequest, res: Response) {
		try {
			const currentUserId = req.user.id;

			const jobData = req.body;

			const jobService = new JobService();

			const response = await jobService.createJob(currentUserId, jobData);

			res.status(201).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async getJobs(req: Request, res: Response) {
		try {
			const { filter, sort, page, pageSize, fields } = req.query;

			const pageNumber = page ? parseInt(page as string) : undefined;
			const pageSizeNumber = pageSize ? parseInt(pageSize as string) : undefined;

			const fieldsArray = typeof fields === 'string' ? fields.split(',') : fields;

			const params: IQueryParams = {
				filter: filter ? JSON.parse(filter as string) : undefined,
				sort: sort as string | undefined,
				page: pageNumber,
				pageSize: pageSizeNumber,
				fields: fieldsArray as string[] | undefined,
			};

			const jobService = new JobService();

			const response = await jobService.getJobs(params);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
	public async getJob(req: Request, res: Response) {
		try {
			const jobId: string = req.params.jobId;

			const jobService = new JobService();

			const response = await jobService.getJob(jobId);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
	
	public async updateJob(req: Request, res: Response) {
		try {
			const jobId: string = req.params.jobId;

			console.log(req);

			const jobService = new JobService();

			const response = await jobService.updateJob(jobId, req.body);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}

	public async deleteJob(req: Request, res: Response) {
		try {
			const jobId: string = req.params.jobId;

			const jobService = new JobService();

			const response = await jobService.deleteJob(jobId);

			res.status(200).json(response);
		} catch (error: unknown) {
			if (error instanceof Error) {
				res.status(400).json({ message: error.message });
			} else {
				res.status(500).json({ message: 'An unexpected error occurred' });
			}
		}
	}
}
