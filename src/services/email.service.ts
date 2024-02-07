import { IEmployee } from '../interfaces';
import db from '../models';

export class EmailService {
  public sendEmail = async (type: string) => {};

  public sendPasswordResetEmail = async () => {};

  public sendImprovementEmail = async () => {};

  public createEmailSignature = async (employeeId: string) => {
    // const employee = await db.Employee.findByPk(employeeId);
    // if (!employee) {
    //   throw new Error('Employee does not exist');
    // }
    // const existingSignature = await db.EmailSignature.findOne({ where: { employeeId: employee.id } });
    // const generateHTML = () => {
    //   const fullName = `${employee.firstName} ${employee.lastName}`;
    //   const email = employee.email;
    //   const phone = employee.extension ? `${employee.officePhone} ext. ${employee.extension}` : employee.officePhone;
    //   const companyInfo = {
    //     'three-m': {
    //       themeColor: '#0073e6',
    //       logoUrl: 'https://example.com/three-m-logo.png',
    //       socialLinks: {
    //         facebook: 'https://facebook.com/three-m',
    //         twitter: 'https://twitter.com/three-m',
    //         linkedin: 'https://linkedin.com/company/three-m',
    //       },
    //     },
    //     'ultra-grip': {
    //       themeColor: '#ff5722',
    //       logoUrl: 'https://example.com/ultra-grip-logo.png',
    //       socialLinks: {
    //         facebook: 'https://facebook.com/ultra-grip',
    //         twitter: 'https://twitter.com/ultra-grip',
    //         linkedin: 'https://linkedin.com/company/ultra-grip',
    //       },
    //     },
    //   };
    //   const { themeColor, logoUrl, socialLinks } = companyInfo[employee.company as keyof typeof companyInfo];
    //   return `
    //   <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
    //     <img src="${logoUrl}" alt="Company Logo" style="max-width: 100px; display: block;">
    //     <div style="background-color: ${themeColor}; color: #fff; padding: 10px;">
    //       <h2 style="margin: 0;">${fullName}</h2>
    //       <p style="margin: 0;">${email} | ${phone}</p>
    //     </div>
    //     <div style="padding: 10px;">
    //       <a href="${socialLinks.facebook}" style="margin-right: 10px;"><img src="https://example.com/facebook-icon.png" alt="Facebook" style="width: 24px;"></a>
    //       <a href="${socialLinks.twitter}" style="margin-right: 10px;"><img src="https://example.com/twitter-icon.png" alt="Twitter" style="width: 24px;"></a>
    //       <a href="${socialLinks.linkedin}"><img src="https://example.com/linkedin-icon.png" alt="LinkedIn" style="width: 24px;"></a>
    //     </div>
    //   </div>
    // `;
    // };
    // let emailSignature;
    // if (existingSignature) {
    //   await db.EmailSignature.update({ html: generateHTML() }, { where: { id: existingSignature.id } });
    //   emailSignature = await db.EmailSignature.findOne({ where: { id: existingSignature.id } });
    // } else {
    //   emailSignature = await db.EmailSignature.create({ employeeId: employee.id, html: generateHTML() });
    // }
    // return emailSignature;
  };
}
