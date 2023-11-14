import { Request, Response } from "express";
import { CameraService } from "../services/cameraService";

export class CameraController {
  public static async createCamera(req: Request, res: Response) {
    try {
      const newCamera = await CameraService.createCamera(req.body);

      res.status(201).json(newCamera);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  }

  public static async validateConnection(req: Request, res: Response) {}
}
