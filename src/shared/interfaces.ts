export interface ICommon {
  id: string;
}

export interface IQueryParams {
  filter?: Record<string, any>;
  sort?: string;
  page?: number;
  pageSize?: number;
  fields?: string[];
}

export interface IAddress {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IApplicant {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  resume: string;
  answers: IAnswers;
}

export interface IApplication extends ICommon {
  careerId: string;
  status: Enumerator;
  source: Enumerator;
  applicant: IApplicant;
  submittedAt: Date;
  processedAt?: Date;
}

export interface IApplicationDirectory {
  applications: IApplication[];
  count: number;
}

export type IAnswers = [IQuestionAnswer, IQuestionAnswer, IQuestionAnswer, IQuestionAnswer];

export interface ICareer extends ICommon {
  title: string;
  description: string;
  location: Enumerator;
  company: Enumerator;
  department: string;
  employmentType: Enumerator;
  responsibilities: object;
  qualifications: object;
  startingAt: string;
  compensationType: Enumerator;
  benefits: object;
  status: Enumerator;
  applicantCount: number;
  createdBy: string;
  updatedBy: string;
}

export interface ICareerDirectory {
  careers: ICareer[];
  count: number;
}

export interface IDepartment extends ICommon {
  name: string;
  teamMemberCount: number;
}

export interface IDepartmentDirectory {
  departments: IDepartment[];
  count: number;
}

export interface IInquiry extends ICommon {
  status: Enumerator;
  organization: Enumerator;
  message: IMessage;
  submittedAt: Date;
}

export interface IInquiryDirectory {
  inquiries: IInquiry[];
  count: number;
}

export interface IMessage {
  name: string;
  company: string;
  email: string;
  subject: string;
  body: string;
}

export interface ITeamMember extends ICommon {
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
  type: Enumerator;
  status: Enumerator;
  salary?: number;
  notes?: string;
  createdBy: string;
  updatedBy: string;
  hiredAt: Date;
  terminatedAt?: Date;
  resignedAt?: Date;
}

export interface ITeamMemberDirectory {
  teamMembers: ITeamMember[];
  count: number;
}

export interface IResume extends ICommon {
  status: Enumerator;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  s3Ref: string;
  submittedAt: Date;
}

export interface ISubscriber extends ICommon {
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

export interface IUser extends ICommon {
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

export interface IUserPermissions extends ICommon {
  userId: string;

  // user
  canViewUsers: boolean;
  canAddUser: boolean;
  canEditUser: boolean;
  canDeleteUser: boolean;

  // employee
  canViewEmployees: boolean;
  canAddEmployee: boolean;
  canEditEmployee: boolean;
  canDeleteEmployee: boolean;

  // career
  canViewCareers: boolean;
  canAddCareer: boolean;
  canEditCareer: boolean;
  canDeleteCareer: boolean;

  // applicant
  canViewApplicants: boolean;
  canEditApplicant: boolean;
  canDeleteApplicant: boolean;

  // bulletin
  canPostBulletin: boolean;
  canEditBulletin: boolean;
  canDeleteBulletin: boolean;
}

export interface IQuestionAnswer {
  question: string;
  answer: string;
}
