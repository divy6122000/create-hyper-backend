import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware.ts";
import routes from "./routes/index.ts";
import connectDB from "./config/db.connection.ts";
import { config } from "./config/index.ts";
// [IMPORT_SECTION]

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: config.NODE_ENV === 'production' ? undefined : false
}));
connectDB();
// [MIDDLEWARE_SECTION]

// Routes
app.use("/api/v1", routes);
// [ROUTE_SECTION]

// Health Check
app.get("/", (_: Request, res: Response) => {
    res.json({
        status: "success",
        message: "Welcome to Hyper Backend API",
        timestamp: new Date().toISOString(),
    });
});

// Error Handler
app.use(errorHandler);

export default app;
