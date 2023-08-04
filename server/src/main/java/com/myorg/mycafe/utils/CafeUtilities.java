package com.myorg.mycafe.utils;

import org.apache.pdfbox.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Map;


public class CafeUtilities {

    public static ResponseEntity<String> getResponse(String body, HttpStatus status) {
        return new ResponseEntity<String>(body, status);
    }

    public static String concatenateEndPoints(String[] endpoints, char character) {
        StringBuilder result = new StringBuilder();

        for(int i = 0; i < endpoints.length; i++) {
            result.append(endpoints[i]);
            if(i < endpoints.length - 1)
                result.append(character);
        }

        return result.toString();
    }

    public static boolean validateRequestMapIdAndName(Map<String, String> requestMap, boolean isUpdate) {
        if(requestMap.containsKey("name")) {
            //Update. Updating a table column needs an id for selection.
            if(requestMap.containsKey("id") && isUpdate) return true;
            //Add
            if(!isUpdate) return true;
        }
        return false;
    }

    public static String getUUID() {
        long time = new Date().getTime();
        return "Bill-"+time;
    }

    public static byte[] getFileBytes(File file) {
        byte[] result;

        try(InputStream stream = new FileInputStream(file)) {
            result = IOUtils.toByteArray(stream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return result;
    }
}
