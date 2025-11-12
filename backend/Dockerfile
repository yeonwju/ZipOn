FROM gradle:8.10-jdk17 AS builder

WORKDIR /app

COPY gradlew ./
COPY gradle gradle
COPY build.gradle settings.gradle ./

RUN ./gradlew dependencies --no-daemon || true

COPY . .

RUN ./gradlew clean bootJar --no-daemon

FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

ARG FRONT_URL
ENV FRONT_URL=${FRONT_URL}
ENV SPRING_PROFILES_ACTIVE=dev
ENV JAVA_OPTS="-Xms512m -Xmx1024m -Dfile.encoding=UTF-8"

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
