FROM maven:3.9.6-eclipse-temurin-22 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:22-jdk-slim

WORKDIR /app

COPY --from=build /app/target/CARSOLD-0.0.1-SNAPSHOT.jar ./CARSOLD-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "CARSOLD-0.0.1-SNAPSHOT.jar"]