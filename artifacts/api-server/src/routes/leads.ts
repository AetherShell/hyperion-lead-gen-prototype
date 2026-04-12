import { Router } from "express";
import type { Request, Response } from "express";
import { db, leadsTable } from "@workspace/db";

const router = Router();

router.post("/leads", async (req: Request, res: Response) => {
  const { name, email, phone, zipCode, time } = req.body as {
    name: string;
    email: string;
    phone: string;
    zipCode: string;
    time: string;
  };

  if (!name || !email || !phone || !zipCode || !time) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    await db.insert(leadsTable).values({
      name,
      email,
      phone,
      zipCode,
      preferredTime: time,
    });

    req.log.info({ email, zipCode }, "New lead submitted");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save lead to database");
    res.status(500).json({ error: "Failed to save submission" });
  }
});

export default router;
