import { Injectable } from "@nestjs/common";

@Injectable()
export class VerificationService {
  upload(file: Express.Multer.File) {
    return { status: "uploaded", filename: file?.originalname };
  }

  status() {
    return { phone: "VERIFIED", steward: "PENDING" };
  }
}
