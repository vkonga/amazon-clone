# Base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy the shared library first (since it is a dependency of user-service)
COPY shared ./shared

# Copy package configurations
COPY package*.json ./

# Install dependencies for the shared library
RUN cd shared && npm ci --omit=dev

# Install dependencies for the user-service
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose service port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]
