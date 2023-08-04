package com.myorg.mycafe.jwt;

import com.myorg.mycafe.utils.CafeUtilities;
import com.myorg.mycafe.utils.JwtUtilities;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Value("${endpoint.base}")
    private String baseEndpoint;

    @Autowired
    private JwtUtilities jwtUtil;

    @Autowired
    private CustomerDetailsService customerService;

    private String username = null;
    private Claims claims = null;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        String[] noAuthEndpoints = new String[]{
                baseEndpoint+"users/login",
                baseEndpoint+"users/signup",
                baseEndpoint+"users/password/forgot"
        };
        /*
        *
        * if true, redirect the request and response to the next filter
        * Else, endpoint needs to have JWT authentication first before moving to the next filter
        * */
        if(request.getServletPath().matches(CafeUtilities.concatenateEndPoints(noAuthEndpoints, '|'))) {
            filterChain.doFilter(request, response);
        }
        else {
            String encType = "Bearer ";
            String authHeader = request.getHeader("Authorization");
            String token = null;
            /*
            * Extract token from client
            * */
            try {
                if (authHeader != null && authHeader.startsWith(encType)) {
                    token = authHeader.substring(encType.length() - 1);
                    username = jwtUtil.extractUsername(token);
                    claims = jwtUtil.extractAllClaims(token);
                }
            } catch (ExpiredJwtException e) {
                log.warn("Token expired.");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            if(username == null) {
                log.warn("Bad Credentials.");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            UserDetails userDetails = customerService.loadUserByUsername(username);
            /*
             * Validate token and set and active status for client
             * */
            if(SecurityContextHolder.getContext().getAuthentication() == null) {
                if(jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken credentials =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    userDetails.getPassword(),
                                    userDetails.getAuthorities());
                    credentials.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(credentials);
                } else {
                    log.warn("Invalid Token");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            }

            filterChain.doFilter(request, response);
        }
    }

    public boolean hasRole(String role) {

        return role.equalsIgnoreCase((String) claims.get("role"));
    }

    public String getCurrentUser() {
        return username;
    }

}
