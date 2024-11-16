# Sử dụng node:18-alpine làm base image
FROM node:18-alpine

# Cài đặt các dependencies cần thiết
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    pixman-dev

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json (hoặc yarn.lock) để cài đặt dependencies
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy source code
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Mở port 3000 để chạy ứng dụng
EXPOSE 3000

# Chạy ứng dụng trong môi trường sản xuất
CMD ["npm", "start"]
