package com.myorg.mycafe.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Service
public class EncryptionUtilities {

    @Value("${pass.aes.key}")
    private String aesSecretKey;

    public String encryptPassAes(String input) throws
            NoSuchPaddingException,
            NoSuchAlgorithmException,
            IllegalBlockSizeException,
            BadPaddingException,
            InvalidKeyException {
        Cipher cipher =
                Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(
                Cipher.ENCRYPT_MODE,
                new SecretKeySpec(aesSecretKey.getBytes(StandardCharsets.UTF_8),"AES")
        );
        byte[] encryptedData = cipher.doFinal(input.getBytes());
        return new BigInteger(encryptedData).toString(16);
    }

    public String decryptPassAes(String input) throws
            NoSuchPaddingException,
            NoSuchAlgorithmException,
            IllegalBlockSizeException,
            BadPaddingException,
            InvalidKeyException {
        BigInteger bigInteger = new BigInteger(input, 16);
        byte[] convertedBytes = bigInteger.toByteArray();

        /*
        * Note: The problem below occurs if one of the BigInteger constructors that is
        * used to convert raw/encrypted password to byte array explicitly add a signum argument.
        * Both must add signum argument or leave it.
        *
        * if convertedBytes length is greater than 16, Remove the first element in the
        * convertedBytes because toByteArray() adds
        * an extra zero as first element in the array. This is not a robust solution though.
        * This may break in some circumstances.
        * Better solution here is to implement your own decryption logic for
        * encrypted password in hex form.
        *
        * byte[] encryptedData = convertedBytes.length > 16 ?
                Arrays.copyOfRange(convertedBytes, 1, convertedBytes.length) :
                convertedBytes;
        * */

        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(
                Cipher.DECRYPT_MODE,
                new SecretKeySpec(aesSecretKey.getBytes(StandardCharsets.UTF_8),"AES")
        );

        byte[] decryptedData = cipher.doFinal(convertedBytes);
        return new String(decryptedData);
    }
}
