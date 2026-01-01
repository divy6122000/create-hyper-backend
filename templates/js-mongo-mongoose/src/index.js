import app from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
import chalk from "chalk";
// [IMPORT_SECTION]

const PORT = config.PORT || 3000;

// [INIT_SECTION]


httpServer.listen(PORT, () => {
    logger.info(chalk.green(`🚀 Server running on port ${PORT}`));
    logger.info(chalk.blue(`👉 http://localhost:${PORT}`));
});
