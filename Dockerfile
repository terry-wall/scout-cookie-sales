FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Remove any existing lock files
RUN rm -f package-lock.json npm-shrinkwrap.json yarn.lock pnpm-lock.yaml

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]