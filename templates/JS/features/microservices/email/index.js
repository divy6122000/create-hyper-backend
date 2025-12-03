import { logger } from "../../utils/logger.js";
import chalk from "chalk";

export const initEmailService = () => {
    logger.info(chalk.green("📨 Email Service Initialized"));

    // Mock email sending logic
    const sendEmail = (to, subject, body) => {
        logger.info(chalk.blue(`📧 Sending email to ${to}: ${subject}`));
    };

    return { sendEmail };
};
