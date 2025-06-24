# Use Node base image for frontend build
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Build React app
RUN npm run build

# Use a static server to serve build (e.g., serve)
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
