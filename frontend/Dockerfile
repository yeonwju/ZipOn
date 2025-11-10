# --- 1) Build Stage ---
FROM node:20-bullseye-slim AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL=/api
ARG NEXT_PUBLIC_KAKAO_MAP_API_KEY
ARG NEXT_PUBLIC_PWA_ENABLE=1

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# --- Install dependencies ---
COPY package*.json ./
RUN rm -rf node_modules package-lock.json \
  && npm cache clean --force \
  && npm install \
  && npm rebuild --verbose

# Set NODE_ENV after installing dependencies to include devDependencies
ENV NODE_ENV=production

# --- Copy source ---
COPY . .
RUN printf "NEXT_PUBLIC_API_BASE_URL=%s\nNEXT_PUBLIC_KAKAO_MAP_API_KEY=%s\nNEXT_PUBLIC_PWA_ENABLE=%s\n" \
  "$NEXT_PUBLIC_API_BASE_URL" "$NEXT_PUBLIC_KAKAO_MAP_API_KEY" "$NEXT_PUBLIC_PWA_ENABLE" > .env.production

# --- Build Next.js ---
RUN npm run build

# --- 2) Run Stage ---
FROM node:20-bullseye-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./ 
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["npm", "run", "start"]
