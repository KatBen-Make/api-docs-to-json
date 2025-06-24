# Use Node base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install
COPY . .

# Expose port & start
EXPOSE 5000
CMD ["npm", "start"]
