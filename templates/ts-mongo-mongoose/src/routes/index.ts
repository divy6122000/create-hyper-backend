import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import { Request, Response } from "express";

const router = Router();

router.use("/auth", authRoutes);

router.get("/status", (_req: Request, res: Response) => {
    return res.json({ success: true, message: "API is working", data: [] });
});

export default router;
