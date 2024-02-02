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
	phone?: string;
	addressId?: string;
	birthDate?: Date;
	company: Enumerator;
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
	accessDevelopment: boolean;
	accessProduction: boolean;
}

export interface IQueryParams {
	filter?: Record<string, any>;
	sort?: string;
	page?: number;
	pageSize?: number;
	fields?: string[];
}
