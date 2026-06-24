# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy shared library
COPY shared ./shared

# Copy product service
COPY product-service ./product-service

# Install shared dependencies
WORKDIR /app/shared
RUN npm install --omit=dev

# Install product-service dependencies
WORKDIR /app/product-service
RUN npm install --omit=dev

# Expose application port
EXPOSE 3002

# Start application
CMD ["npm", "start"]