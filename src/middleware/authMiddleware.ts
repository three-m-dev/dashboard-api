import jwt from "jsonwebtoken";
import db from "../models";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

interface ExtendedRequest extends Request {
  user?: typeof db.User;
}

const protect = asyncHandler(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

      req.user = await db.User.findByPk(decoded.userId);

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

export { protect, ExtendedRequest };
