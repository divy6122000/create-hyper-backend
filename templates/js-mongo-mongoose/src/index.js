import app from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
import chalk from "chalk";
// [IMPORT_SECTION]

// [INIT_SECTION]
app.listen(config.PORT, () => {
    logger.info(chalk.green(`🚀 Server running on port ${config.PORT}`));
    logger.info(chalk.blue(`👉 http://localhost:${config.PORT}`));
});
