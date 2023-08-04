package com.myorg.mycafe.restimpl;

import com.myorg.mycafe.rest.UserRest;
import com.myorg.mycafe.service.UserService;
import com.myorg.mycafe.wrapper.UserWrapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class UserRestImpl implements UserRest {

    @Autowired
    UserService userService;

    @Override
    public ResponseEntity<String> signup(Map<String, String> requestMap) {
        return userService.signup(requestMap);
    }

    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        return userService.login(requestMap);
    }

    @Override
    public ResponseEntity<String> forgotPass(Map<String, String> requestMap) {
        return userService.forgotPass(requestMap);
    }

    @Override
    public ResponseEntity<List<UserWrapper>> getUsers() {
        return userService.getUsers();
    }

    @Override
    public ResponseEntity<String> checkToken(Map<String, String> headers) {
        return userService.checkUserToken(headers);
    }

    @Override
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        return userService.logout(request, response);
    }

    @Override
    public ResponseEntity<String> updateUserStatus(Map<String, String> requestMap) {
        return userService.updateUserStatus(requestMap);
    }

    @Override
    public ResponseEntity<String> changePass(Map<String, String> requestMap) {
        return userService.changePass(requestMap);
    }
}
