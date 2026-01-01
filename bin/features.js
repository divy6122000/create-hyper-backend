import fs from "fs-extra";
import path from "path";
import { getTemplateDir } from "./constant.js";
import { cp } from "fs/promises";
const TEMPLATE_DIR = getTemplateDir();

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

export async function handleFeatures(projectPath, answers) {
    const srcPath = path.join(projectPath, "src");

    // GraphQL
    if (answers.graphql && answers.typescript) {
        await fs.copy(path.join(TEMPLATE_DIR, "TS/features/graphql/src"), srcPath);
        await injectCode(path.join(srcPath, "app.ts"), {
            import: `import { createApolloServer } from "./graphql/index.ts";`,
            middleware: `const apolloServer = await createApolloServer();\napp.use("/graphql", apolloServer);`
        });
    } else if (answers.graphql && !answers.typescript) {
        await fs.copy(path.join(TEMPLATE_DIR, "JS/features/graphql/src"), srcPath);
        await injectCode(path.join(srcPath, "app.js"), {
            import: `import { createApolloServer } from "./graphql/index.js";`,
            middleware: `const apolloServer = await createApolloServer();\napp.use("/graphql", apolloServer);`
        });
    }



    if (answers.socket && answers.typescript) {
        console.log("socket11")
        await fs.copy(path.join(TEMPLATE_DIR, "TS/features/socket/src"), srcPath);
        await injectCode(path.join(srcPath, "index.ts"), {
            import: `import { initSocket } from "./socket/index.js";\nimport { createServer } from "http";`,
            init: `const httpServer = createServer(app);\ninitSocket(httpServer);\n`
        });

        // We need to change app.listen to httpServer.listen in index.ts
        let indexContent = await fs.readFile(path.join(srcPath, "index.ts"), "utf-8");
        indexContent = indexContent.replace("app.listen(config.PORT", "httpServer.listen(config.PORT");
        await fs.writeFile(path.join(srcPath, "index.ts"), indexContent);
    } else if (answers.socket && !answers.typescript) {
        console.log("socket22");
        await fs.copy(path.join(TEMPLATE_DIR, "JS/features/socket/src"), srcPath);
        await injectCode(path.join(srcPath, "index.js"), {
            import: `import { initSocket } from "./socket/index.js";\nimport { createServer } from "http";`,
            init: `const httpServer = createServer(app);\ninitSocket(httpServer);\n`
        });

        // We need to change app.listen to httpServer.listen in index.ts
        let indexContent = await fs.readFile(path.join(srcPath, "index.js"), "utf-8");
        indexContent = indexContent.replace("app.listen(config.PORT", "httpServer.listen(config.PORT");
        await fs.writeFile(path.join(srcPath, "index.js"), indexContent);
    }

    // Prisma

    // if (answers.database !== "MongoDB" || answers.mongoORM === "Prisma") {
    //     await fs.copy(path.join(TEMPLATE_DIR, answers.typescript ? "TS/features/prisma" : "JS/features/prisma"), projectPath);

    //     // Update schema.prisma provider
    //     const schemaPath = path.join(projectPath, "prisma/schema.prisma");
    //     let schemaContent = await fs.readFile(schemaPath, "utf-8");

    //     let provider = "postgresql";
    //     if (answers.database === "MySQL") {
    //         provider = "mysql";

    //         await fs.ensureDir(path.join(srcPath, answers.typescript ? "TS/features/prisma/src/config/prisma.ts" : "JS/features/prisma/src/config/prisma.js"));
    //         const test = await injectCode(path.join(srcPath, answers.typescript ? "config/prisma.ts" : "config/prisma.js"), {
    //             import: `import "dotenv/config";\nimport { PrismaMariaDb } from '@prisma/adapter-mariadb';\nimport { PrismaClient } from '../../prisma/generated/prisma/client.${answers.typescript ? "js" : "ts"}';`,
    //             init: `const adapter = new PrismaMariaDb({
    //                         host: process.env.DATABASE_HOST,
    //                         user: process.env.DATABASE_USER,
    //                         password: process.env.DATABASE_PASSWORD,
    //                         database: process.env.DATABASE_NAME,
    //                         connectionLimit: 5
    //                     }); \n\nexport const prisma = new PrismaClient({ adapter, log: process.env.NODE_ENV === "development" ? ['query', 'info', 'warn', 'error'] : ['error'] })`
    //         });
    //     }
    //     if (answers.database === "MongoDB") provider = "mongodb";

    //     schemaContent = schemaContent.replace('provider = "postgresql"', `provider = "${provider}"`);
    //     await fs.writeFile(schemaPath, schemaContent);
    // }

    // Microservices
    // if (answers.microservice) {
    //     await fs.ensureDir(path.join(srcPath, "micro-services"));

    //     if (answers.emailMicroservice) {
    //         await fs.copy(path.join(TEMPLATE_DIR, answers.typescript ? "TS/features/micro-services/email" : "JS/features/micro-services/email"), path.join(srcPath, "micro-services/email"));
    //     }

    //     if (answers.cronMicroservice) {
    //         await fs.copy(path.join(TEMPLATE_DIR, answers.typescript ? "TS/features/micro-services/cron" : "JS/features/micro-services/cron"), path.join(srcPath, "micro-services/cron"));
    //     }
    // }
}

export const selectTemplate = (answers) => {
    let template;
    // ---------------------------
    // MongoDB
    // ---------------------------
    if (answers.database === "MongoDB") {
        if (!answers.typescript) {
            if (answers.mongoORM === "None") template = "js-mongo-mongoose";
            else if (answers.mongoORM === "Prisma") template = "js-mongo-prisma";
            else if (answers.mongoORM === "Drizzle") template = "js-mongo-drizzle";
        } else {
            if (answers.mongoORM === "None") template = "ts-mongo-mongoose";
            else if (answers.mongoORM === "Prisma") template = "ts-mongo-prisma";
            else if (answers.mongoORM === "Drizzle") template = "ts-mongo-drizzle";
        }
    }

    // ---------------------------
    // MySQL
    // ---------------------------
    if (answers.database === "MySQL") {
        if (!answers.typescript) template = "js-mysql";
        else template = "ts-mysql";
    }

    // ---------------------------
    // PostgreSQL
    // ---------------------------
    if (answers.database === "PostgreSQL") {
        if (!answers.typescript) template = "js-postgres";
        else template = "ts-postgres";
    }

    return template;
};
