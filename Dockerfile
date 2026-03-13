FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive

# Configure debconf to avoid interactive prompts and handle conffile conflicts
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Add curl for health checks with proper dependency handling
# Use -o Dpkg::Options::="--force-confdef" to use default for conffile prompts
# Use -o Dpkg::Options::="--force-confold" to keep existing conffiles
RUN apt-get update && \
    apt-get install -y --fix-missing --no-install-recommends \
    -o Dpkg::Options::="--force-confdef" \
    -o Dpkg::Options::="--force-confold" \
    curl \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

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