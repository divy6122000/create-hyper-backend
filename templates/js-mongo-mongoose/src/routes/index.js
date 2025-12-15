import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.get("/status", (req, res) => {
    return res.json({ success: true, message: "API is working", data: [] });
});

export default router;
