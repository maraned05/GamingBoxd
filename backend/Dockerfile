# Use Node.js LTS version
FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 