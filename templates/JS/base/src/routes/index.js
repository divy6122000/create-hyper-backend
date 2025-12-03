import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.get("/status", (req, res) => {
    res.json({ status: "API is working" });
});

export default router;
