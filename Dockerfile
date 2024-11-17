FROM node:18-alpine

# Cài đặt dependencies cơ bản
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    pixman-dev

# Đặt thư mục làm việc
WORKDIR /app

# Copy và cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install 

# Copy toàn bộ mã nguồn
COPY . .

# Bỏ qua kiểm tra TypeScript
ENV NEXT_IGNORE_TYPECHECK=true
ENV DISABLE_TYPE_CHECKS=true

# Mở port
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]
