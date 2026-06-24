
# Base image
FROM node:18-alpine
 
# Set working directory in container
WORKDIR /app
 
# Copy the shared library first
COPY shared ./shared
 
# Copy the service code
COPY product-service ./product-service
 
# Install dependencies for the shared library
RUN cd shared && npm ci --omit=dev
 
# Install dependencies for the product-service
RUN cd product-service && npm ci --omit=dev
 
# Set active working directory
WORKDIR /app/product-service
 
# Expose service port
EXPOSE 3002
 
# Start the service
CMD ["npm", "start"]
