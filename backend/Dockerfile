FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm run prisma:generate && npm run build

EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:push && npm run prisma:seed && npm run start"]
