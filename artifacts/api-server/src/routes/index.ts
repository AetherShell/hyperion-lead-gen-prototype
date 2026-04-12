import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import adminRouter from "./admin";
import ordersRouter from "./orders";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(ordersRouter);
router.use(adminRouter);

export default router;
