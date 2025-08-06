# Stage 1: Build the client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/. .
RUN npm run build

# Stage 2: Build the server
FROM node:20-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install
COPY server/. ./server/

# Copy client build output
COPY --from=client-builder /app/client/dist ./client/dist

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server/index.js"]
