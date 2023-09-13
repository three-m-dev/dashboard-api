import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Employee from "../models/employee";

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    id,
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    password,
    jobTitle,
    department,
    employmentType,
    startDate,
    salary,
    reportsTo,
    isActive,
    notes,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dateOfBirth ||
    !password ||
    !jobTitle ||
    !department ||
    !employmentType ||
    !startDate ||
    !salary ||
    !reportsTo ||
    isActive === undefined
  ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
    return;
  }

  const emailExists = await Employee.findOne({ where: { email } });

  if (emailExists) {
    res.status(400).json({ message: "Email already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Employee.create({
    id,
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    password: hashedPassword,
    jobTitle,
    department,
    employmentType,
    startDate,
    salary,
    reportsTo,
    isActive,
    notes,
  });

  if (user) {
    const accessToken = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!
    );
    res.status(201).json({
      token: accessToken,
      user,
    });
    return;
  } else {
    res.status(400).json({ message: "Invalid user data" });
    return;
  }
});

const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const user = await Employee.findOne({ where: { email } });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      res.status(401).json({ message: "Invalid email or password" });
    } else {
      const accessToken = sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!
      );
      res.status(200).json({
        token: accessToken,
        user,
      });
    }
  });
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await Employee.findAll();

  if (!users || users.length === 0) {
    res.status(404).json({ message: "Users not found" });
  } else {
    res.status(200).json(users);
  }
});

export { createUser, authUser, getUsers };
