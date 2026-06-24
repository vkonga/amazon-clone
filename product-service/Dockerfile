# Base image
FROM node:18-alpine

# Working directory
WORKDIR /app

# Copy source code
COPY shared ./shared
COPY product-service ./product-service

# Install shared dependencies
WORKDIR /app/shared
RUN npm install --omit=dev

# Install product-service dependencies
WORKDIR /app/product-service
RUN npm install --omit=dev

# Environment variables
ENV PORT=3002
ENV MONGODB_URI="mongodb+srv://venkatesh:Young1997@cluster0.qndyo50.mongodb.net/amazon_clone_product?appName=Cluster0"
ENV JWT_SECRET="secret123"
ENV NODE_ENV=development
ENV LOG_LEVEL=info

# Expose application port
EXPOSE 3002

# Start application
CMD ["npm", "start"]