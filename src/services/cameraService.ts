import { ICamera } from '../interfaces/ICommon';
import db from '../models';

export class CameraService {
	static async createCamera(data: ICamera) {
		const requiredFields = ['name', 'ipAddress', 'port', 'username', 'password'] as const;

		const missingField = requiredFields.find((field) => !data[field]);

		if (missingField) {
			throw new Error(`Missing required field: ${missingField}`);
		}

		const existingCamera = db.Camera.findAll({ where: { ipAddress: data.ipAddress, port: data.port } });

		if (existingCamera.length > 0) {
			throw new Error('Camera already associated with IP address & port');
		}

		const camera = await db.Camera.create(data);

		return camera;
	}

	static async validateConnection(cameraId: string) {}

	static async getCameras() {}

	static async getCameraById(cameraId: string) {}

	static async updateCamera(cameraId: string) {}

	static async deleteCamera(cameraId: string) {}

	static async connectCamera() {}

	static async getLiveFeed() {}

	static async disconnectCamera() {}
}
