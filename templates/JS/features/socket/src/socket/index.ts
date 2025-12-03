import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { logger } from "../utils/logger.js";
import chalk from "chalk";

export const initSocket = (server: HttpServer) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        logger.info(chalk.blue(`🔌 User connected: ${socket.id}`));

        socket.on("disconnect", () => {
            logger.info(chalk.yellow(`❌ User disconnected: ${socket.id}`));
        });

        // Example custom event
        socket.on("user:message", (data) => {
            logger.info(`📩 Message from ${socket.id}: ${JSON.stringify(data)}`);
            io.emit("user:message", data); // Broadcast
        });
    });

    return io;
};
