import { NextFunction } from 'express';

const asyncWrapper = (controller: any) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await controller(req, res, next);
		} catch (error) {
			next(error);
		}
	};
};

export default asyncWrapper;
