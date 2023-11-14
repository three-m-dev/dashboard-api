import jwt from 'jsonwebtoken';
import db from '../models';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

interface ExtendedRequest extends Request {
	user?: typeof db.User;
}

const protect = asyncHandler(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	if (req.cookies && req.cookies.jwt) {
		try {
			const token = req.cookies.jwt;

			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { userId: string };

			if (!decoded.userId) {
				throw new Error('Invalid token');
			}

			req.user = await db.User.findByPk(decoded.userId);

			next();
		} catch (error) {
			res.status(401).json({ message: 'Not authorized, token failed' });
		}
	} else {
		res.status(401).json({ message: 'Not authorized, no token' });
	}
});

export { protect, ExtendedRequest };
