# --- 1단계: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- 2단계: Run Stage ---
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app ./

# 3000포트로 서비스
EXPOSE 3000
CMD ["npm", "run", "start"]
