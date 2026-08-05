package com.finsync.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class AccountNumberGenerator {

    public String generateAccountNumber() {

        Random random = new Random();

        long number = 1000000000L + random.nextInt(900000000);

        return String.valueOf(number);
    }
}