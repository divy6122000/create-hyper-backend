
import fs from "fs-extra";

export async function updatePackageJson(filePath, answers) {
    const pkg = await fs.readJson(filePath);

    pkg.name = answers.projectName;

    // Database Dependencies
    if (answers.database === "MongoDB" && answers.mongoORM === "Mongoose") {
        // Already in base
    } else {
        delete pkg.dependencies["mongoose"];
        if (answers.database === "MySQL") pkg.dependencies["mysql2"] = "^3.15.3";
        if (answers.database === "PostgreSQL") pkg.dependencies["pg"] = "^8.16.3";
    }

    // Prisma Dependencies
    if (answers.database !== "MongoDB" || answers.mongoORM === "Prisma") {
        pkg.devDependencies["prisma"] = "^7.0.1";
        pkg.dependencies["@prisma/client"] = "^7.0.1";
    }

    if(answers.database === "MySQL" && answers.mongoORM === "Prisma") {
        pkg.dependencies["@prisma/adapter-mariadb"] = "^7.0.1";
    }

    // GraphQL Dependencies
    if (answers.graphql) {
        pkg.dependencies["@as-integrations/express5"] = "^1.1.2";
        pkg.dependencies["@graphql-tools/merge"] = "^9.1.6";
        pkg.dependencies["@apollo/server"] = "^5.2.0";
        pkg.dependencies["graphql"] = "^16.12.0";
        pkg.dependencies["graphql-tag"] = "^2.12.6";
    }

    // Socket.io Dependencies
    if (answers.socket) {
        pkg.dependencies["socket.io"] = "^4.8.1";
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