# =========================
# 1. Build stage
# =========================
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Maven wrapper và file cấu hình trước
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Cấp quyền thực thi cho Maven Wrapper
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build Spring Boot application
RUN ./mvnw clean package -DskipTests


# =========================
# 2. Runtime stage
# =========================
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy JAR từ build stage
COPY --from=build /app/target/*.jar app.jar

# Spring Boot port
EXPOSE 10000

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]