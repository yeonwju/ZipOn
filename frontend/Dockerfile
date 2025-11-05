# --- 1단계: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

ENV NPM_CONFIG_CACHE=/root/.npm

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=production

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

COPY --from=builder /app ./

ENV NPM_CONFIG_CACHE=/root/.npm

EXPOSE 3000

CMD ["npm", "run", "start"]
