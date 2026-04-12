import { Router } from "express";
import type { Request, Response } from "express";
import { db, ordersTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.post("/orders", async (req: Request, res: Response) => {
  const {
    name, email, phone, address, city, state, zipCode,
    ownershipType, preferredDate, accessNotes,
    monthlySoapCost, monthlyWaterCost,
    signatureData, signedName,
  } = req.body as {
    name: string; email: string; phone: string;
    address: string; city: string; state: string; zipCode: string;
    ownershipType: string; preferredDate: string; accessNotes?: string;
    monthlySoapCost: number; monthlyWaterCost: number;
    signatureData: string; signedName: string;
  };

  if (!name || !email || !phone || !address || !city || !state || !zipCode ||
      !ownershipType || !preferredDate || !signatureData || !signedName) {
    res.status(400).json({ error: "All required fields must be provided" });
    return;
  }

  try {
    const [order] = await db.insert(ordersTable).values({
      name, email, phone, address, city, state, zipCode,
      ownershipType, preferredDate, accessNotes: accessNotes ?? null,
      monthlySoapCost: Number(monthlySoapCost),
      monthlyWaterCost: Number(monthlyWaterCost),
      signatureData, signedName,
    }).returning({ id: ordersTable.id });

    req.log.info({ email, orderId: order.id }, "New order submitted");
    res.json({ success: true, orderId: order.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save order");
    res.status(500).json({ error: "Failed to submit order" });
  }
});

router.get("/admin/orders", async (req: Request, res: Response) => {
  if (!req.session.adminAuthenticated) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
    res.json({ orders });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch orders");
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
