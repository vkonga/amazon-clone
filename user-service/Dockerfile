# Base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose service port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]
