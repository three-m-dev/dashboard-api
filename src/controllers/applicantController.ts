import { Request, Response } from "express";
import { ApplicantService } from "../services/applicantService";
import { IQueryParams } from "../shared/interfaces";

export class ApplicantController {
  public async createApplicant(req: Request, res: Response) {
    try {
      const applicantData = req.body;

      const applicantService = new ApplicantService();

      const response = await applicantService.createApplicant(applicantData);

      res.status(201).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public async getApplicants(req: Request, res: Response) {
    try {
      const { filter, sort, page, pageSize, fields } = req.query;

      const pageNumber = page ? parseInt(page as string) : undefined;
      const pageSizeNumber = pageSize ? parseInt(pageSize as string) : undefined;

      const fieldsArray = typeof fields === "string" ? fields.split(",") : fields;

      const params: IQueryParams = {
        filter: filter ? JSON.parse(filter as string) : undefined,
        sort: sort as string | undefined,
        page: pageNumber,
        pageSize: pageSizeNumber,
        fields: fieldsArray as string[] | undefined,
      };

      const applicantService = new ApplicantService();

      const response = await applicantService.getApplicants(params);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public async getApplicant(req: Request, res: Response) {
    try {
      const applicantId = req.params.applicantId;

      const applicantService = new ApplicantService();

      const response = await applicantService.getApplicant(applicantId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public async deleteApplicant(req: Request, res: Response) {
    try {
      const applicantId = req.params.applicantId;

      const applicantService = new ApplicantService();

      const response = await applicantService.deleteApplicant(applicantId);

      res.status(200).json(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
}
