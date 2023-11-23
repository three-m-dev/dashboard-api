import { ICamera } from '../interfaces/ICommon';
import db from '../models';

export class CameraService {
	static async createCamera(data: ICamera) {
		const { name, ipAddress, port } = data;

		const requiredFields = [name, ipAddress, port];

		requiredFields.forEach((field) => {
			if (!field) {
				throw new Error(`Missing required field ${field}`);
			}
		});

		const existingIp = await db.Camera.findOne({ where: { ipAddress } });

		if (existingIp) {
			throw new Error(`Camera with IP address ${ipAddress} already exists`);
		}

		const existingName = await db.Camera.findOne({ where: { name } });

		if (existingName) {
			throw new Error(`Camera with name ${name} already exists`);
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
