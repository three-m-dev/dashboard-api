export interface IUser {
  userId: string;
  username: string;
  password: string;
  accountType: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface IUserInfo extends Omit<IUser, "password"> {}

export interface IUserDirectory {
  users: IUserInfo[];
  count: number;
}

export interface IUserParams {
  userId?: string;
  accountType?: string;
  isActive?: string;
}

export interface IAddress {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IEmployee {
  employeeId: string;
  userId: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address: IAddress;
  dateOfBirth?: Date;
  hireDate: Date;
  role: string;
  department: string;
  directReport: string;
  employmentStatus: string;
  salary?: number;
  endDate?: Date;
  notes?: string;
}

export interface IEmployeeInfo extends Omit<IEmployee, "address" | "dateOfBirth" | "salary" | "endDate" | "notes"> {}

export interface IEmployeeDirectory {
  employees: IEmployeeInfo[];
  count: number;
}

export interface IJobListing {
  jobListingId: string;
  title: string;
  description: string;
  company: Enumerator;
  location: Enumerator;
  department: string;
  employmentType: Enumerator;
  requirements: object;
  qualifications: object;
  salaryRange: string;
  benefits: object;
  listingStatus: Enumerator;
  createdBy: string;
  updatedBy: string;
}

export interface IJobListingDirectory {
  jobListings: IJobListing[];
  count: number;
}

export interface IQuestionAnswer {
  question: string;
  answer: string;
}

export type IAnswers = [IQuestionAnswer, IQuestionAnswer, IQuestionAnswer, IQuestionAnswer];

export interface IApplicant {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  resume: string;
  answers: IAnswers;
}

export interface IJobApplication {
  jobApplicationId: string;
  jobListingId: string;
  applicationDate: Date;
  applicationStatus: Enumerator;
  applicationSource: Enumerator;
  applicant: IApplicant;
}
