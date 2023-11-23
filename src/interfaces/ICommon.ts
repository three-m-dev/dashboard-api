export interface IUser {
	id: string;
	username: string;
	password: string;
	accountType: string;
	isActive: boolean;
	createdBy: string;
	updatedBy: string;
}

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}

export interface IUserDirectory {
	users: IUserWithoutPassword[];
	count: number;
}

export interface IUserParams {
	id?: string;
	accountType?: string;
	isActive?: string;
}

export interface IPermissions {
	id: string;
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

export interface IAddress {
	addressLine?: string;
	city?: string;
	state?: string;
	country?: string;
	postalCode?: string;
}

export interface ITeamMember {
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

export interface IDepartment {
	id: string;
	name: string;
	teamMemberCount: number;
}

export interface IDepartmentDirectory {
	departments: IDepartment[];
	count: number;
}

export interface ICareerListing {
	id: string;
	title: string;
	description: string;
	location: Enumerator;
	company: Enumerator;
	department: string;
	employmentType: Enumerator;
	requirements: object;
	qualifications: object;
	startingAt: string;
	compensationType: Enumerator;
	benefits: object;
	status: Enumerator;
	applicantCount: number;
	createdBy: string;
	updatedBy: string;
}

export interface ICareerListingDirectory {
	careerListings: ICareerListing[];
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

export interface ICareerApplication {
	id: string;
	careerListingId: string;
	status: Enumerator;
	source: Enumerator;
	applicant: IApplicant;
	submittedAt: Date;
	processedAt?: Date;
}

export interface ICareerApplicationDirectory {
	careerApplications: ICareerApplication[];
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

export interface ICamera {
	id: string;
	status: Enumerator;
	name: string;
	ipAddress: string;
	port: string;
}

export interface ICameraDirectory {
	cameras: ICamera[];
	count: number;
}
