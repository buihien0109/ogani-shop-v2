package com.example.ogani.utils;

public class StringUtils {
    public static String generateLinkImage(String str) {
        return "https://placehold.co/200x200?text=" + str.substring(0, 1).toUpperCase();
    }
}
