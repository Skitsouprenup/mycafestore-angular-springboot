package com.myorg.mycafe.serviceimpl;

import com.google.common.base.Strings;
import com.myorg.mycafe.constants.CafeConstants;
import com.myorg.mycafe.dao.UserDao;
import com.myorg.mycafe.jwt.CustomerDetailsService;
import com.myorg.mycafe.jwt.JwtFilter;
import com.myorg.mycafe.models.User;
import com.myorg.mycafe.service.UserService;
import com.myorg.mycafe.utils.CafeUtilities;
import com.myorg.mycafe.utils.EmailUtils;
import com.myorg.mycafe.utils.EncryptionUtilities;
import com.myorg.mycafe.utils.JwtUtilities;
import com.myorg.mycafe.wrapper.UserWrapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    AuthenticationManager authManager;

    @Autowired
    CustomerDetailsService customerService;

    @Autowired
    JwtUtilities jwtUtil;

    @Autowired
    JwtFilter jwtFilter;

    @Autowired
    EmailUtils emailUtils;

    @Autowired
    EncryptionUtilities encryptionUtilities;

    @Override
    public ResponseEntity<String> signup(Map<String, String> requestMap) {
        //log.info("request map in signup: {}", requestMap);

        String[] requiredFields =
                new String[]{"name", "contactNumber", "email", "password"};

        boolean allExist = true;
        for(String key : requiredFields) {
            if(!requestMap.containsKey(key)) {
                allExist = false;
                break;
            }
        }
        if(!allExist) {
            String responseBody = "{\"message\": \""+ CafeConstants.REQUEST_MISSING_FIELDS +"\"}";
            return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
        }

        try{
            User user = userDao.findByEmailId(requestMap.get("email"));
            if(user == null) {
                try{
                    userDao.save(createUser(requestMap));
                } catch(Exception e) {
                    e.printStackTrace();
                    String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
                }

                String responseBody = "{\"message\": \""+ "User has been successfully registered!" +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.CREATED);
            }
            else {
                String responseBody = "{\"message\": \""+ "Email already exists!" +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
            }
        }
        catch(Exception e) {
            e.printStackTrace();

            String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
            return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        //log.info("request map in login: {}", requestMap);
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            requestMap.get("email"),
                            requestMap.get("password"))
            );

            if(auth.isAuthenticated() &&
                    customerService.getUserDetail().getStatus().equalsIgnoreCase("true")) {
                return new ResponseEntity<>("{\"Token\":\""+
                        jwtUtil.generateToken(
                                customerService.getUserDetail().getEmail(),
                                customerService.getUserDetail().getRole()
                                )+"\"}", HttpStatus.OK);
            }
            else {
                String responseBody = "{\"message\": \""+ "User still waiting for admin approval." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.UNAUTHORIZED);
            }
        }
        catch(Exception e) {
            e.printStackTrace();
            String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
            return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<UserWrapper>> getUsers() {
        try {
            if(jwtFilter.hasRole("admin")) {
                return new ResponseEntity<>(userDao.getUsers(), HttpStatus.OK);
            } else return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateUserStatus(Map<String, String> requestMap) {
        try {
            if(jwtFilter.hasRole("admin")) {
                Optional<User> optUser = userDao.findById(Integer.parseInt(requestMap.get("id")));

                if(optUser.isPresent()) {
                    userDao.updateStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));
                    sendMailToAdmins(
                            requestMap.get("status"),
                            optUser.get().getEmail(),
                            userDao.getAdmins());

                    String responseBody = "{\"message\": \""+ "User status has been updated." +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
                }
                else {
                    String responseBody = "{\"message\": \""+ "Id Doesn't Exist." +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
                }
            }
            else {
                String responseBody = "{\"message\": \""+ "Unauthorized Access." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.UNAUTHORIZED);
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
        return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> changePass(Map<String, String> requestMap) {
        try {
            User user = userDao.findByEmail(jwtFilter.getCurrentUser());

            if(user != null) {
                if(user.getPassword().equals(requestMap.get("oldPass"))) {
                    user.setPassword(requestMap.get("newPass"));
                    userDao.save(user);

                    String responseBody = "{\"message\": \""+ "Password has been updated." +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
                }
                else {
                    String responseBody = "{\"message\": \""+ "Incorrect Password" +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
                }
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
        return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> forgotPass(Map<String, String> requestMap) {
        try {
            User user = userDao.findByEmail(requestMap.get("email"));
            if(!Objects.isNull(user) && !Strings.isNullOrEmpty(user.getEmail())) {
                emailUtils.sendHtmlFormattedMessage(
                        user.getEmail(),
                        "My Cafe Store Credentials",
                        encryptionUtilities.decryptPassAes(user.getPassword()));
                String responseBody =
                        "{\"message\": \""
                        +"Requested Credentials has been sent to ."
                        +user.getEmail()+"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
            }
            else {
                String responseBody = "{\"message\": \""+ "Bad Credentials" +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
        return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> checkUserToken(Map<String, String> headers) {
        try {
            /*
            String encType = "Bearer ";
            String authHeader = headers.get("authorization");

            String token = authHeader.substring(encType.length() - 1);
            Claims claims = jwtUtil.extractAllClaims(token);
            System.out.println(claims.get("role"));
            * */
            return CafeUtilities.getResponse(null, HttpStatus.OK);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return CafeUtilities.getResponse(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null){
            new SecurityContextLogoutHandler().logout(request, response, auth);
            return CafeUtilities.getResponse(null, HttpStatus.OK);
        }
        return CafeUtilities.getResponse(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private void sendMailToAdmins( @NonNull String status, String email, @NonNull List<String> admins) {

        for(int i = 0; i < admins.size(); i++) {
            if(jwtFilter.getCurrentUser().equals(admins.get(i))) {
                admins.remove(i);
                break;
            }
        }
        if(status.equalsIgnoreCase("true")) {
            String body = "User \""+email+"\""+"\n"+
                    " has been approved by Admin \""+jwtFilter.getCurrentUser()+"\"";
            emailUtils.sendSimpleMessage(email, "Account Approved", body, admins);
        }
        else {
            String body = "User \""+email+"\""+"\n"+
                    " has been disabled by Admin \""+jwtFilter.getCurrentUser()+"\"";
            emailUtils.sendSimpleMessage(email, "Account Disabled", body, admins);
        }

    }

    private User createUser(Map<String, String> map) throws Exception {
        User user = new User();
        user.setName(map.get("name"));
        user.setContactNumber(map.get("contactNumber"));
        user.setEmail(map.get("email"));
        user.setPassword(encryptionUtilities.encryptPassAes(map.get("password")));
        user.setStatus("false");
        user.setRole("user");

        return user;
    }
}
