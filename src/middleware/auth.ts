import jwt from 'jsonwebtoken';
import db from '../models';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

interface ExtendedRequest extends Request {
	account?: typeof db.Account;
}

const protect = asyncHandler(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
	if (req.cookies && req.cookies.token) {
		try {
			const token = req.cookies.token;

			const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & { accountId: string };

			if (!decoded.accountId) {
				throw new Error('Invalid token');
			}

			req.account = await db.Account.findByPk(decoded.accountId);

			next();
		} catch (error) {
			res.status(401).json({ message: 'Not authorized, token failed' });
		}
	} else {
		res.status(401).json({ message: 'Not authorized, no token' });
	}
});

export { protect, ExtendedRequest };
