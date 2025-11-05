# --- 1단계: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

ENV NPM_CONFIG_CACHE=/root/.npm

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

RUN echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}" > .env.production

RUN npm run build

# --- 2단계: Run Stage ---
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NPM_CONFIG_CACHE=/root/.npm

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]
