package org.gontar.carsold.TestEnvConfig;

import io.github.cdimascio.dotenv.Dotenv;

//sets .env variables for testing
//need to set GOOGLE_APPLICATION_CREDENTIALS manually in Test Configuration, because it's being read differently
public class TestEnvConfig {

    public static void loadEnv() {
        Dotenv dotenv = Dotenv.load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}