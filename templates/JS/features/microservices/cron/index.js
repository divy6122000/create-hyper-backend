import cron from "node-cron";
import { logger } from "../../utils/logger.js";
import chalk from "chalk";

export const initCronService = () => {
    logger.info(chalk.green("⏰ Cron Service Initialized"));

    cron.schedule("* * * * *", () => {
        logger.info(chalk.blue(`[${new Date().toISOString()}] Running a task every minute`));
    });
};
