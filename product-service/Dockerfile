# Base image
FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
COPY product-service ./product-service

WORKDIR /app/shared
RUN npm install --omit=dev

WORKDIR /app/product-service
RUN npm install --omit=dev

# Environment Variables
ENV MONGODB_URI=mongodb://your-mongodb-host:27017/productdb

EXPOSE 3002

CMD ["npm", "start"]