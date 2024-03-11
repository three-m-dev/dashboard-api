export interface IAccount {
  id: string;
  username: string;
  password: string;
  accountType: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface IAddress {
  id: string;
  accountId: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface IEmployee {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email?: string;
  cellPhone?: string;
  officePhone?: string;
  extension?: string;
  addressId?: string;
  birthDate?: Date;
  company: string;
  department: Enumerator;
  directReportId: string;
  title: string;
  status: Enumerator;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface IPermission {
  id: string;
  accountId: string;
  accessEmployees: boolean;
  accessCareers: boolean;
  accessContent: boolean;
}

export interface IQueryParams {
  filter?: Record<string, any>;
  sort?: string;
  page?: number;
  pageSize?: number;
  fields?: string[];
}

export interface IDocument {
  id: string;
  ownerId?: string;
  ownerType: string;
  documentType: string;
  s3URL: string;
}

export interface ICareer {
  id: string;
  company: string;
  title: string;
  location: string;
  employmentType: string;
  salary: string;
  description: string;
  benefits: string[];
  qualifications: string[];
  responsibilities: string[];
  schedule: string[];
  questions: string[];
  positionsOpen: number;
}

export interface IApplicant {
  id: string;
  careerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  s3URL: string;
  questionAnswers: string[];
}

export interface IBlog {
  id: string;
  title: string;
  author: string;
  content: string[];
}
