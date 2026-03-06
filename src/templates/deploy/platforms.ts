import type { ProjectConfig } from '../types';

export function generateVercelConfig(config: ProjectConfig): string {
  const isFullstack = config.type === 'fullstack';
  const hasBackend = ['api', 'fullstack'].includes(config.type);

  return JSON.stringify(
    {
      version: 2,
      name: config.projectName,
      buildCommand: hasBackend ? undefined : 'npm run build',
      devCommand: hasBackend ? undefined : 'npm run dev',
      installCommand: 'npm install',
      framework: config.framework === 'nextjs' ? 'nextjs' : 'vite',
      outputDirectory: 'dist',
    },
    null,
    2
  );
}

export function generateNetlifyConfig(config: ProjectConfig): string {
  return `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
}

export function generateRailwayToml(config: ProjectConfig): string {
  return `[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
`;
}

export function generateRenderYaml(config: ProjectConfig): string {
  const hasBackend = ['api', 'fullstack'].includes(config.type);

  return `services:
  - type: web
    name: ${config.projectName}
    env: ${hasBackend ? 'node' : 'static'}
    buildCommand: npm install && npm run build
    startCommand: ${hasBackend ? 'npm run start' : 'echo "Static site"'}
`;
}

export function generateDockerfile(config: ProjectConfig): string {
  const hasBackend = ['api', 'fullstack'].includes(config.type);

  if (hasBackend) {
    return `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
`;
  }

  return `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;
}

export function generateNginxConfig(config: ProjectConfig): string {
  return `server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 "healthy";
        add_header Content-Type text/plain;
    }
}
`;
}

export function generateDeployGuide(config: ProjectConfig): string {
  return `# Deploy Guide

## Quick Deploy

### Vercel
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Railway
\`\`\`bash
npm i -g @railway/cli
railway login
railway up
\`\`\`

### Render
\`\`\`bash
# Connect your repo in render.com
# Deploy automatically on push
\`\`\`

## Docker
\`\`\`bash
docker build -t ${config.projectName} .
docker run -p 3000:3000 ${config.projectName}
\`\`\`

## Environment Variables

Set these in your platform:
- \`NODE_ENV\` = production
${['api', 'fullstack'].includes(config.type) ? "- \`DATABASE_URL\` = your database URL" : ''}
${['api', 'fullstack'].includes(config.type) ? "- \`JWT_SECRET\` = your secret key" : ''}
`;
}
