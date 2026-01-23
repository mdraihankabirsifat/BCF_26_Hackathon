# Coffee Shop Server Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]
