import inquirer from "inquirer";
export async function askQuestions() {
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
            choices: ["Prisma", "Drizzle", "None"],
        },
        {
            type: "confirm",
            name: "socket",
            message: "Would you like to use Socket.io?",
            default: false
        },
        {
            type: "confirm",
            name: "graphql",
            message: "Would you like to use GraphQL?",
            default: false
        },
        {
            type: "confirm",
            name: "microservice",
            message: "Would you like to use microservices?",
            default: false
        }
    ]);
    return answers;
}