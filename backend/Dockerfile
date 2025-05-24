FROM node:23-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
EXPOSE 3001
CMD ["node", "index.js"]