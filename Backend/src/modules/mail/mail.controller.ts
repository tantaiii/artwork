import { MailService } from "./mail.service";
import { Request, Response } from "express";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

export class MailController {
  static sendTokenMail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== "string" || email.trim() === "") {
        return res.status(400).json(responseWrapper("error", "Email is required"));
      }

      const token = await MailService.generateAndSendToken(email.trim());
      
      return res.status(200).json(
        responseWrapper("success", "Token sent successfully", { token })
      );
    } catch (error: any) {
      // 1. In lỗi chi tiết ra Terminal Backend để tiện chẩn đoán
      console.error("❌ ERROR IN MAIL CONTROLLER:", error);

      // 2. Trả về thông điệp lỗi thực sự giúp Frontend/DevTools nhận biết nguyên nhân
      const errorMessage = error?.message || "Internal Server Error";
      return res.status(500).json(responseWrapper("error", errorMessage));
    }
  };
}

export default MailController;