import { Router } from "express";
import type { Request, Response } from "express";
import { appendLeadToSheet } from "../lib/googleSheets.js";
import { sendLeadNotification } from "../lib/gmail.js";

const router = Router();

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  time: string;
}

router.post("/leads", async (req: Request, res: Response) => {
  const { name, email, phone, zipCode, time } = req.body as LeadData;

  if (!name || !email || !phone || !zipCode || !time) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const lead: LeadData = { name, email, phone, zipCode, time };

  try {
    const [sheetsResult, emailResult] = await Promise.allSettled([
      appendLeadToSheet(lead),
      sendLeadNotification(lead),
    ]);

    if (sheetsResult.status === "rejected") {
      req.log.error({ err: sheetsResult.reason }, "Failed to append lead to Google Sheet");
    }
    if (emailResult.status === "rejected") {
      req.log.error({ err: emailResult.reason }, "Failed to send lead notification email");
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Unexpected error processing lead submission");
    res.status(500).json({ error: "Failed to process submission" });
  }
});

export default router;
