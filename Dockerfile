FROM node:22-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxrandr2 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY services/*/package*.json ./services/
COPY shared/package*.json ./shared/
COPY apps/*/package*.json ./apps/

RUN npm install --omit=dev

COPY . .

RUN mkdir -p logs

EXPOSE 3000 3001 3002 3003 4001 4002 4003 4004

CMD ["npx", "pm2-runtime", "ecosystem.config.js"]
