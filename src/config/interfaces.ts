export interface ICommon {
  id: string;
}

export interface IAddress {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IApplicant extends ICommon {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeRef?: string;
  resumeLink?: string;
  answers: string[];
  additionalInfo?: string;
}

export interface IApplication extends ICommon {
  jobId: string;
  applicantId: string;
  applicationDate: Date;
  phoneScreenDate?: Date;
  interviewDate?: Date;
  status: Enumerator;
  notes?: string;
  ratings?: IRating[];
}

export interface ICompany extends ICommon {
  addressId: string;
  name: string;
}

export interface IDepartment extends ICommon {
  companyId: string;
  name: string;
}

export interface IEmployee extends ICommon {
  userId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  addressId?: string;
  birthDate?: Date;
  title: string;
  departmentId: string;
  directReportId: string;
  type: Enumerator;
  status: Enumerator;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdBy: string;
  updatedBy: string;
}

export interface IJob extends ICommon {
  companyId: string;
  departmentId: string;
  title: string;
  description: string;
  location: Enumerator;
  type: Enumerator;
  status: Enumerator;
  benefits?: object;
  requirements?: object;
  qualifications?: object;
  schedule?: object;
  payment: Enumerator;
  startingPay: number;
  positionsOpen: number;
  createdBy: string;
  updatedBy: string;
  closingAt?: Date;
}

export interface IRating extends ICommon {
  type: Enumerator;
  value: number;
  notes?: string;
  createdBy: string;
}

export interface IUser extends ICommon {
  username: string;
  password: string;
  accountType: string;
  permissionsId: string;
}

export interface IUserWithoutPassword extends Omit<IUser, "password"> {}

// To Add
// Downtime
// Operation
// Blog
//
