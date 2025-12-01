import cron from "node-cron";
import chalk from "chalk";

console.log(chalk.green("⏰ Cron Service Started"));

// Schedule a task to run every minute
cron.schedule("* * * * *", () => {
    console.log(chalk.blue(`[${new Date().toISOString()}] Running a task every minute`));
});
