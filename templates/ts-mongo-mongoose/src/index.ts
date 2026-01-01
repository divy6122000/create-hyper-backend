import app from "./app.ts";
import { config } from "./config/index.ts";
import { logger } from "./utils/logger.ts";
import chalk from "chalk";
// [IMPORT_SECTION]

// [INIT_SECTION]
app.listen(config.PORT, () => {
    logger.info(chalk.green(`🚀 Server running on port ${config.PORT}`));
    logger.info(chalk.blue(`👉 http://localhost:${config.PORT}`));
});
