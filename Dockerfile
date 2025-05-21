# Dockerfile for Node.js (Bun) clients and workers
FROM oven/bun:1.1 as base
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .

# Default command is overridden by docker-compose
CMD ["bun", "run", "src/client/sender.ts"]
