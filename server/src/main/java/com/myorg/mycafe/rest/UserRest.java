package com.myorg.mycafe.rest;

import com.myorg.mycafe.wrapper.UserWrapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@PropertySource("classpath:application.properties")
@RequestMapping(path = "${endpoint.base}"+"users")
public interface UserRest {

    @GetMapping(path = "/all")
    ResponseEntity<List<UserWrapper>> getUsers();

    @GetMapping(path = "/token/verify")
    ResponseEntity<String> checkToken(@RequestHeader Map<String, String> headers);

    @GetMapping(path = "/logout")
    ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response);
    /*
    * Request body is required by default if @RequestBody annotation
    * is associated with a Map
    * */

    @PostMapping(path = "/signup")
    ResponseEntity<String> signup(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/login")
    ResponseEntity<String> login(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/password/forgot")
    ResponseEntity<String> forgotPass(@RequestBody Map<String, String> requestMap);

    @PatchMapping(path = "/update/status")
    ResponseEntity<String> updateUserStatus(@RequestBody Map<String, String> requestMap);

    @PatchMapping(path = "/password/change")
    ResponseEntity<String> changePass(@RequestBody Map<String, String> requestMap);

}
