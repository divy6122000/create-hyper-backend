#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { getTemplateDir, GITIGNORE } from "./constant.js";
import { askQuestions } from "./questions.js";
import { handleFeatures } from "./features.js";
import { updatePackageJson } from "./updatePackages.js";

const TEMPLATE_DIR = getTemplateDir();

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
        if (answers.typescript) {
            await fs.copy(path.join(TEMPLATE_DIR, "TS/base"), projectPath);
        } else {
            await fs.copy(path.join(TEMPLATE_DIR, "JS/base"), projectPath);
        }
        
        // create a .gitignore file
        fs.writeFileSync(path.join(projectPath, ".gitignore"), GITIGNORE);
        
        // 2. Handle Features
        await handleFeatures(projectPath, answers);
        
        // 3. Update package.json
        await updatePackageJson(path.join(projectPath, "package.json"), answers);

        console.log(chalk.green(`✅ Project created successfully!\n`));
        console.log(chalk.cyan(`📦 Next steps:\n`));
        console.log(chalk.white(`  cd ${answers.projectName}`));
        console.log(chalk.white(`  npm install`));
        if (answers.database !== "MongoDB" || answers.mongoORM === "Prisma") {
            console.log(chalk.white(`  npx prisma migrate dev --name init`));
            console.log(chalk.white(`  npx prisma generate`));
            // npx prisma migrate dev --name init
        }
        console.log(chalk.white(`  npm run dev\n`));

    } catch (error) {
        console.error(chalk.red("❌ Error creating project:"), error);
        process.exit(1);
    }
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