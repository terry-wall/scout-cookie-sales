FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive

# Add curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Remove any existing lock files
RUN rm -f package-lock.json npm-shrinkwrap.json yarn.lock pnpm-lock.yaml

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/api/ready || exit 1

CMD ["npm", "run", "start"]