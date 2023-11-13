export interface IUser {
  id: string;
  username: string;
  password: string;
  accountType: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

export interface IUserDirectory {
  users: IUserWithoutPassword[];
  count: number;
}

export interface IUserParams {
  id?: string;
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
  id: string;
  userId: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address: IAddress;
  dateOfBirth?: Date;
  company: Enumerator;
  department: string;
  role: string;
  directReport: string;
  status: string;
  salary?: number;
  notes?: string;
  createdBy: string;
  updatedBy: string;
  hiredAt: Date;
  terminatedAt?: Date;
  resignedAt?: Date;
}

export interface IEmployeeDirectory {
  employees: IEmployee[];
  count: number;
}

export interface IJobListing {
  id: string;
  title: string;
  description: string;
  location: Enumerator;
  company: Enumerator;
  department: string;
  employmentType: Enumerator;
  requirements: object;
  qualifications: object;
  salaryRange: string;
  benefits: object;
  status: Enumerator;
  applicantCount: number;
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
  id: string;
  jobListingId: string;
  status: Enumerator;
  source: Enumerator;
  applicant: IApplicant;
  submittedAt: Date;
  processedAt?: Date;
}

export interface IJobApplicationDirectory {
  jobApplications: IJobApplication[];
  count: number;
}

export interface IResume {
  id: string;
  status: Enumerator;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  s3Ref: string;
  submittedAt: Date;
}

export interface ISubscriber {
  id: string;
  email: string;
  isSubscribed: boolean;
  unsubscribeToken: string;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

export interface ISubscriberDirectory {
  subscribers: ISubscriber[];
  count: number;
}

export interface IMessageBody {
  firstName: string;
  lastName: string;
  company: string;
  phoneNumber: string;
  email: string;
  text: string;
}

export interface IMessage {
  id: string;
  status: Enumerator;
  company: Enumerator;
  body: IMessageBody;
  submittedAt: Date;
}

export interface IMessageDirectory {
  messages: IMessage[];
  count: number;
}
