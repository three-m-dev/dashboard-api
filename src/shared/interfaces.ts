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
  answers?: string[];
  additionalInfo?: string;
}

export interface IApplication extends ICommon {
  jobId?: string;
  applicantId: string;
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
  company: Enumerator;
  name: string;
}

export interface IEmployee extends ICommon {
  userId: string;
  departmentId: string;
  directReportId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  addressId?: string;
  birthDate?: Date;
  company: Enumerator;
  title: string;
  type: Enumerator;
  status: Enumerator;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface IJob extends ICommon {
  departmentId: string;
  company: Enumerator;
  title: string;
  description: string;
  location: Enumerator;
  type: Enumerator;
  status: Enumerator;
  benefits?: string[];
  requirements?: string[];
  qualifications?: string[];
  schedule?: string[];
  salary?: number;
  wage?: number;
  positionsOpen: number;
  createdBy: string;
  updatedBy?: string;
  closingAt?: Date;
}

export interface IQueryParams {
  filter?: Record<string, any>;
  sort?: string;
  page?: number;
  pageSize?: number;
  fields?: string[];
}

export interface IRating extends ICommon {
  value: number;
  notes?: string;
  createdBy: string;
}

export interface IUser extends ICommon {
  username: string;
  password: string;
  accountType: string;
  permissionsId: string;
  isActive: boolean;
}

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}

export interface IProductionLog extends ICommon {
  weekOf: Date;
  projectedOutput: number;
  actualOutput: number;
  outputGoal: number;
  quotedHours?: number;
  actualHours?: number;
  indirectHours?: number;
  notes?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface IDowntimeEntry extends ICommon {
  operatorId: string;
  date: string;
  downtime: {
    [reason: string]: number;
  };
  notes?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface IDowntimeReport {
  totalDowntime: number;
  downtime: {
    [reason: string]: number;
  };
}

export interface IDowntimeFilter {
  dateRange?: {
    start?: string;
    end: string;
  };
  operatorId?: string;
}
