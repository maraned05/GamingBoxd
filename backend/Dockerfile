FROM node:23-alpine
WORKDIR /app

COPY . .
RUN npm install

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 3001
CMD ["node", "index.js"]