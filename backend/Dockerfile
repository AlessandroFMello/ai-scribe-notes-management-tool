FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-slim AS production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN npm ci --only=production && \
    npm install tsx prisma @prisma/client --save-dev && \
    npx prisma generate

COPY --from=builder /app/dist ./dist

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

RUN mkdir -p ./uploads

RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

EXPOSE 3000

ENV NODE_ENV=production

CMD ["./start.sh"]

