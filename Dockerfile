FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json knexfile.ts ./
COPY src ./src

RUN npm run build

FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations
COPY knexfile.ts tsconfig.json ./
RUN npm install ts-node typescript @types/node

EXPOSE 3000

CMD ["sh", "-c", "npx knex migrate:latest --knexfile knexfile.ts && node dist/index.js"]
