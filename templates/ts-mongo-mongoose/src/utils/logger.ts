import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file"; // Ensure: npm i winston-daily-rotate-file
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "../config/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsDir = join(__dirname, '../logs');
mkdirSync(logsDir, { recursive: true }); // Creates logs/ if missing

const transports = [
    // Console for dev/debug (all levels)
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }),
];

if (config.NODE_ENV === "production") {
    // General logs (info, warn, debug) to daily files
    transports.push(
        new DailyRotateFile({
            filename: join(logsDir, 'app-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '5m',
            maxFiles: '30d',
            level: 'info', // Captures info and above (warn, error too, but errors go to separate file)
        })
    );
    // Error logs only, to separate daily files
    transports.push(
        new DailyRotateFile({
            filename: join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '5m',
            maxFiles: '30d',
            level: 'error', // Only errors (and critical)
            handleExceptions: true,
            // Optional: Handle uncaught exceptions
        })
    );
}

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports,
});

export const logError = (message: string, error: Error) => {
    logger.error(message, { error: error.message, stack: error.stack });
};