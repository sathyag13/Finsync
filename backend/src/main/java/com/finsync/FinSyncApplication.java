package com.finsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * This is where the application starts. Running main() boots up an
 * embedded web server (Tomcat) on port 8080 and wires together all the
 * @Component / @Service / @Repository / @RestController classes in this
 * package and its sub-packages.
 */
@SpringBootApplication
public class FinSyncApplication {
    public static void main(String[] args) {
        SpringApplication.run(FinSyncApplication.class, args);
    }
}
