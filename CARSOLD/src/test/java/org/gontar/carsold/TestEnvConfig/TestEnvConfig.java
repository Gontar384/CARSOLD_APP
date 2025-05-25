package org.gontar.carsold.TestEnvConfig;

import io.github.cdimascio.dotenv.Dotenv;

//need to set GOOGLE_APPLICATION_CREDENTIALS and JWT_SECRET_KEY env manually in Test Run Configuration
public class TestEnvConfig {
    public static void loadEnv() {
        Dotenv dotenv = Dotenv.load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}