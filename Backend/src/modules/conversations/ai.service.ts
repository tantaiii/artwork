import { uploadImage } from "../../utils/imageUtils";

const TEXT2IMAGE_ENDPOINT = "https://api.lightxeditor.com/external/api/v1/text2image";
const ORDER_STATUS_ENDPOINT = "https://api.lightxeditor.com/external/api/v1/order-status";

interface CreateOrderResponse {
  body?: { orderId: string };
}

interface StatusResponse {
  body?: { status: "active" | "failed"; output?: string };
}

export class AIService {
  static async generateImage(prompt: string, apiKey: string): Promise<string> {
    // Bước 1: Tạo order
    const createRes = await fetch(TEXT2IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ textPrompt: prompt }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Create order failed: ${createRes.status} ${err}`);
    }

    const createData = (await createRes.json()) as CreateOrderResponse;
    const orderId = createData.body?.orderId;
    if (!orderId) throw new Error("No orderId returned");

    // Bước 2: Poll status
    for (let i = 0; i < 6; i++) {
      await new Promise((r) => setTimeout(r, 3000));

      const statusRes = await fetch(ORDER_STATUS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!statusRes.ok) continue;

      const statusData = (await statusRes.json()) as StatusResponse;
      if (statusData.body?.status === "active" && statusData.body?.output) {
        const uploadRes = await uploadImage(statusData.body.output, 4, false);
        return uploadRes.secure_url;
      }

      if (statusData.body?.status === "failed") {
        throw new Error("AI generation failed");
      }
    }

    throw new Error("Timeout: Image not ready");
  }
}
