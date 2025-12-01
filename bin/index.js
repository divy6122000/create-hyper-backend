#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_DIR = path.join(__dirname, "../templates");

async function askQuestions() {
    if (process.env.TEST_MODE) {
        return JSON.parse(process.env.TEST_ANSWERS || '{}');
    }

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "What is your project named?",
            default: "my-app",
            validate: (input) => {
                if (/^([a-z0-9\-\_\.]+)$/.test(input)) return true;
                return "Project name may only include lowercase letters, numbers, dashes, and underscores.";
            }
        },
        {
            type: "confirm",
            name: "typescript",
            message: "Would you like to use TypeScript?",
            default: true
        },
        {
            type: "list",
            name: "database",
            message: "Which database do you want to use?",
            choices: ["MongoDB", "MySQL", "PostgreSQL"]
        },
        {
            type: "list",
            name: "mongoORM",
            message: "MongoDB detected — choose ORM:",
            choices: ["Mongoose", "Prisma"],
            when: (a) => a.database === "MongoDB"
        },
        {
            type: "confirm",
            name: "graphql",
            message: "Would you like to use GraphQL?",
            default: false
        },
        {
            type: "confirm",
            name: "socket",
            message: "Would you like to use Socket.io?",
            default: false
        },
        {
            type: "confirm",
            name: "microservice",
            message: "Would you like to use microservices?",
            default: false
        },
        {
            type: "confirm",
            name: "emailMicroservice",
            message: "Auto-setup email microservice?",
            default: true,
            when: (a) => a.microservice === true
        },
        {
            type: "confirm",
            name: "cronMicroservice",
            message: "Auto-setup CronJob microservice?",
            default: true,
            when: (a) => a.microservice === true
        }
    ]);

    return answers;
}

async function createProject(answers) {
    const projectPath = path.join(process.cwd(), answers.projectName);

    try {
        if (fs.existsSync(projectPath)) {
            console.error(chalk.red(`❌ Project folder "${answers.projectName}" already exists!`));
            process.exit(1);
        }

        console.log(chalk.blue(`\n📁 Creating project: ${answers.projectName}...`));
        await fs.ensureDir(projectPath);

        // 1. Copy Base Template (Unified Structure)
        await fs.copy(path.join(TEMPLATE_DIR, "base"), projectPath);

        // 2. Handle Features
        await handleFeatures(projectPath, answers);

        // 3. Update package.json
        await updatePackageJson(path.join(projectPath, "package.json"), answers);

        console.log(chalk.green(`✅ Project created successfully!\n`));
        console.log(chalk.cyan(`📦 Next steps:\n`));
        console.log(chalk.white(`  cd ${answers.projectName}`));
        console.log(chalk.white(`  npm install`));
        if (answers.database !== "MongoDB" || answers.mongoORM === "Prisma") {
            console.log(chalk.white(`  npx prisma generate`));
        }
        console.log(chalk.white(`  npm run dev\n`));

    } catch (error) {
        console.error(chalk.red("❌ Error creating project:"), error);
        process.exit(1);
    }
}

async function handleFeatures(projectPath, answers) {
    const srcPath = path.join(projectPath, "src");

    // GraphQL
    if (answers.graphql) {
        await fs.copy(path.join(TEMPLATE_DIR, "features/graphql/src"), srcPath);
        await injectCode(path.join(srcPath, "app.ts"), {
            import: `import { createApolloServer } from "./graphql/index.js";\nimport { expressMiddleware } from "@apollo/server/express4";`,
            middleware: `const apolloServer = await createApolloServer();\napp.use("/graphql", cors(), express.json(), expressMiddleware(apolloServer));`
        });
    }

    // Socket.io
    if (answers.socket) {
        await fs.copy(path.join(TEMPLATE_DIR, "features/socket/src"), srcPath);
        await injectCode(path.join(srcPath, "index.ts"), {
            import: `import { initSocket } from "./socket/index.js";\nimport { createServer } from "http";`,
            init: `const httpServer = createServer(app);\ninitSocket(httpServer);\n// Override app.listen with httpServer.listen`
        });

        // We need to change app.listen to httpServer.listen in index.ts
        let indexContent = await fs.readFile(path.join(srcPath, "index.ts"), "utf-8");
        indexContent = indexContent.replace("app.listen(PORT", "httpServer.listen(PORT");
        await fs.writeFile(path.join(srcPath, "index.ts"), indexContent);
    }

    // Prisma
    if (answers.database !== "MongoDB" || answers.mongoORM === "Prisma") {
        await fs.copy(path.join(TEMPLATE_DIR, "features/prisma"), projectPath);

        // Update schema.prisma provider
        const schemaPath = path.join(projectPath, "prisma/schema.prisma");
        let schemaContent = await fs.readFile(schemaPath, "utf-8");

        let provider = "postgresql";
        if (answers.database === "MySQL") provider = "mysql";
        if (answers.database === "MongoDB") provider = "mongodb";

        schemaContent = schemaContent.replace('provider = "postgresql"', `provider = "${provider}"`);
        await fs.writeFile(schemaPath, schemaContent);
    }

    // Microservices
    if (answers.microservice) {
        await fs.ensureDir(path.join(srcPath, "micro-services"));

        if (answers.emailMicroservice) {
            await fs.copy(path.join(TEMPLATE_DIR, "features/microservices/email"), path.join(srcPath, "micro-services/email"));
        }

        if (answers.cronMicroservice) {
            await fs.copy(path.join(TEMPLATE_DIR, "features/microservices/cron"), path.join(srcPath, "micro-services/cron"));
        }
    }
}

async function injectCode(filePath, injections) {
    let content = await fs.readFile(filePath, "utf-8");

    if (injections.import) {
        content = content.replace("// [IMPORT_SECTION]", `// [IMPORT_SECTION]\n${injections.import}`);
    }
    if (injections.middleware) {
        content = content.replace("// [MIDDLEWARE_SECTION]", `// [MIDDLEWARE_SECTION]\n${injections.middleware}`);
    }
    if (injections.route) {
        content = content.replace("// [ROUTE_SECTION]", `// [ROUTE_SECTION]\n${injections.route}`);
    }
    if (injections.init) {
        content = content.replace("// [INIT_SECTION]", `// [INIT_SECTION]\n${injections.init}`);
    }

    await fs.writeFile(filePath, content);
}

async function updatePackageJson(filePath, answers) {
    const pkg = await fs.readJson(filePath);

    pkg.name = answers.projectName;

    // Database Dependencies
    if (answers.database === "MongoDB" && answers.mongoORM === "Mongoose") {
        // Already in base
    } else {
        delete pkg.dependencies["mongoose"];
        if (answers.database === "MySQL") pkg.dependencies["mysql2"] = "^3.6.5";
        if (answers.database === "PostgreSQL") pkg.dependencies["pg"] = "^8.11.3";
    }

    // Prisma Dependencies
    if (answers.database !== "MongoDB" || answers.mongoORM === "Prisma") {
        pkg.devDependencies["prisma"] = "^5.7.0";
        pkg.dependencies["@prisma/client"] = "^5.7.0";
    }

    // GraphQL Dependencies
    if (answers.graphql) {
        pkg.dependencies["@apollo/server"] = "^4.9.5";
        pkg.dependencies["graphql"] = "^16.8.1";
    }

    // Socket.io Dependencies
    if (answers.socket) {
        pkg.dependencies["socket.io"] = "^4.7.2";
    }

    // Microservices Scripts
    if (answers.microservice) {
        // Add scripts to run microservices
        // Assuming they are just modules for now, but if we want to run them separately:
        // "dev:email": "tsx watch src/micro-services/email/index.ts"

        if (answers.emailMicroservice) {
            pkg.scripts["dev:email"] = "tsx watch src/micro-services/email/index.ts";
        }
        if (answers.cronMicroservice) {
            pkg.dependencies["node-cron"] = "^4.2.1";
            pkg.scripts["dev:cron"] = "tsx watch src/micro-services/cron/index.ts";
        }

        // Update dev script to run everything
        let devScript = "concurrently \"npm:dev:api\"";
        pkg.scripts["dev:api"] = "tsx watch src/index.ts"; // Rename original dev to dev:api

        if (answers.emailMicroservice) devScript += " \"npm:dev:email\"";
        if (answers.cronMicroservice) devScript += " \"npm:dev:cron\"";

        pkg.scripts["dev"] = devScript;
    }

    await fs.writeJson(filePath, pkg, { spaces: 2 });
}

(async () => {
    try {
        const answers = await askQuestions();
        await createProject(answers);
    } catch (error) {
        if (error.isTtyError) {
            console.error(chalk.red("Error: Interactive prompts not supported"));
        } else {
            console.error(chalk.red("Error:"), error);
        }
        process.exit(1);
    }
})();