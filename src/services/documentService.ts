export class DocumentService {
  static async uploadDocument(data: any) {
    const PORT = process.env.PORT || "";
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
    const S3_REGION = process.env.S3_REGION || "";
    const S3_BUCKET = process.env.S3_BUCKET || "";
  }
}
