cat > backend/Dockerfile <<'EOF'
# --- 1단계: Build Stage ---
FROM gradle:8.10-jdk17 AS builder

WORKDIR /app
COPY . .
RUN gradle clean bootJar --no-daemon

# --- 2단계: Run Stage ---
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Front URL 전달
ARG FRONT_URL
ENV frontUrl=${FRONT_URL}

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
EOF
