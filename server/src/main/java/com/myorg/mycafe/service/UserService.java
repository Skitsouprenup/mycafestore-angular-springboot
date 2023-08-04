package com.myorg.mycafe.service;

import com.myorg.mycafe.wrapper.UserWrapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface UserService {

    ResponseEntity<String> signup(Map<String, String> requestMap);
    ResponseEntity<String> login(Map<String, String> requestMap);
    ResponseEntity<List<UserWrapper>> getUsers();
    ResponseEntity<String> updateUserStatus(Map<String, String> requestMap);
    ResponseEntity<String> changePass(Map<String, String> requestMap);
    ResponseEntity<String> forgotPass(Map<String, String> requestMap);

    ResponseEntity<String> checkUserToken(Map<String, String> headers);

    ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response);
}
