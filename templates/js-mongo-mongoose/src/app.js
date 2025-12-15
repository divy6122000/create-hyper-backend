import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";
import connectDB from "./config/db.connection.js";
// [IMPORT_SECTION]

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
connectDB();
// [MIDDLEWARE_SECTION]

// Routes
app.use("/api/v1", routes);
// [ROUTE_SECTION]

// Health Check
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Welcome to Hyper Backend API",
        timestamp: new Date().toISOString(),
    });
});

// Error Handler
app.use(errorHandler);

export default app;
