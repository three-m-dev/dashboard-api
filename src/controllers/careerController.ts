import { Request, Response } from "express";
import { ExtendedRequest } from "../middleware/authMiddleware";
import { CareerService } from "../services/careerService";
import { v4 as uuidv4 } from "uuid";
import { IQueryParams } from "../shared/interfaces";

export class CareerController {
  // Careers
  public static async createCareer(req: ExtendedRequest, res: Response) {
    try {
      const currentUser = req.user.id;

      const career = await CareerService.createCareer(currentUser, req.body);

      res.status(201).json(career);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getCareers(req: Request, res: Response) {
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

      const result = await CareerService.getCareers(params);

      res.status(200).json({
        careers: result.careers,
        totalCareers: result.totalCount,
        totalPages: result.totalPages,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getCareer(req: Request, res: Response) {
    try {
      const careerId: string = req.params.careerId;

      const career = await CareerService.getCareer(careerId);

      res.status(200).json(career);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async updateCareer(req: Request, res: Response) {
    try {
      const careerId: string = req.params.userId;

      const career = await CareerService.updateCareer(careerId);

      res.status(200).json(career);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async deleteCareer(req: Request, res: Response) {
    try {
      const careerId: string = req.params.userId;

      const career = await CareerService.deleteCareer(careerId);

      res.status(200).json(career);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  // Applications
  public static async createApplication(req: ExtendedRequest, res: Response) {
    try {
      const careerId = req.params.careerId;

      const application = await CareerService.createApplication(careerId, req.body);

      res.status(201).json(application);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getApplications(req: Request, res: Response) {
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

      const applications = await CareerService.getApplications(params);

      res.status(200).json(applications);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getApplication(req: Request, res: Response) {
    try {
      const applicationId: string = req.params.applicationId;

      const application = await CareerService.getApplication(applicationId);

      res.status(200).json(application);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async updateApplication(req: Request, res: Response) {
    try {
      const applicationId: string = req.params.applicationId;

      const application = await CareerService.updateApplication(applicationId);

      res.status(200).json(application);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async deleteApplication(req: Request, res: Response) {
    try {
      const applicationId: string = req.params.applicationId;

      const application = await CareerService.deleteApplication(applicationId);

      res.status(200).json(application);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  // Resumes
  public static async createResume(req: Request, res: Response) {
    try {
      const fakeUUID = uuidv4();

      const resume = await CareerService.createResume(fakeUUID, req.body);

      res.status(200).json(resume);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getResumes(req: Request, res: Response) {
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

      const resumes = await CareerService.getResumes(params);

      res.status(200).json(resumes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async getResume(req: Request, res: Response) {
    try {
      const resumeId: string = req.params.resumeId;

      const resume = await CareerService.getResume(resumeId);

      res.status(200).json(resume);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async updateResume(req: Request, res: Response) {
    try {
      const resumeId: string = req.params.resumeId;

      const resume = await CareerService.updateResume(resumeId);

      res.status(200).json(resume);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async deleteResume(req: Request, res: Response) {
    try {
      const resumeId: string = req.params.resumeId;

      const resume = await CareerService.deleteResume(resumeId);

      res.status(200).json(resume);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }
}
