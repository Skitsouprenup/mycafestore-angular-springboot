package com.myorg.mycafe.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        //response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        final String errorMsg =
                response.getStatus() == 401 ?
                "Authentication/Authorization failed" :
                "Something went wrong.";
        final Map<String, Object> body = new HashMap<>();
        body.put("status", response.getStatus());
        body.put("error", authException.getMessage());
        body.put("message", errorMsg);
        body.put("path", request.getRequestURI());

        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), body);
    }
}
