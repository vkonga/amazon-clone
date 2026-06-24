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
ENV MONGODB_URI=mongodb+srv://venkatesh:Young1997@cluster0.qndyo50.mongodb.net/amazon_clone_product?appName=Cluster0

EXPOSE 3002

CMD ["npm", "start"]