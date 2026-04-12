import { Router } from "express";
import type { Request, Response } from "express";
import { db, leadsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response, next: () => void) {
  if (req.session.adminAuthenticated) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

router.post("/admin/login", (req: Request, res: Response) => {
  const { password } = req.body as { password: string };
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!adminPassword) {
    res.status(500).json({ error: "Admin password not configured" });
    return;
  }

  if (password === adminPassword) {
    req.session.adminAuthenticated = true;
    req.session.save((err) => {
      if (err) {
        res.status(500).json({ error: "Session error" });
        return;
      }
      res.json({ success: true });
    });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

router.post("/admin/logout", (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/admin/session", (req: Request, res: Response) => {
  res.json({ authenticated: !!req.session.adminAuthenticated });
});

router.get("/admin/leads", requireAdmin, async (req: Request, res: Response) => {
  try {
    const leads = await db
      .select()
      .from(leadsTable)
      .orderBy(desc(leadsTable.createdAt));
    res.json({ leads });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch leads");
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

export default router;
