# --- 1단계: Build Stage ---
FROM gradle:8.10-jdk17 AS builder

WORKDIR /app
COPY . .
RUN gradle clean bootJar --no-daemon

# --- 2단계: Run Stage ---
FROM openjdk:17-jdk-slim

WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# 8080포트로 서비스
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
