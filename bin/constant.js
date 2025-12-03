import { fileURLToPath } from "url";
import path from "path";
export const GITIGNORE = `node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
package-lock.json
.pnpm-store/
.env
.env.*.local
.env.local
.env.test
.env.production
services/**/.env
microservices/**/.env
dist/
build/
*.tsbuildinfo
logs/
*.log
*.log.*
pids
*.pid
*.seed
*.pid.lock
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
*.swo
prisma/migrations/
prisma/.env
data/
*.sqlite
*.db
graphql/schema.graphql.d.ts
.next/
out/
coverage/
.cache/
.temp/
socket-cache/
microservices/**/node_modules/
microservices/**/dist/
microservices/**/build/
tmp/
temp/
*.tmp
uploads/
public/uploads/
docker-data/
docker/db-data/

`;


export const getTemplateDir = ()=>{
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const TEMPLATE_DIR = path.join(__dirname, "../templates");
    return TEMPLATE_DIR;
}