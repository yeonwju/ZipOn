# --- 1) Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL=/api
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ARG NEXT_PUBLIC_KAKAO_MAP_API_KEY
ARG NEXT_PUBLIC_PWA_ENABLE=1

COPY package*.json ./
RUN npm ci

COPY . .

RUN printf "NEXT_PUBLIC_API_BASE_URL=%s\nNEXT_PUBLIC_KAKAO_MAP_API_KEY=%s\nNEXT_PUBLIC_PWA_ENABLE=%s\n" \
  "$NEXT_PUBLIC_API_BASE_URL" "$NEXT_PUBLIC_KAKAO_MAP_API_KEY" "$NEXT_PUBLIC_PWA_ENABLE" > .env.production

ENV NODE_ENV=production
RUN npm run build

# --- 2) Run Stage ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000
CMD ["npm", "run", "start"]
