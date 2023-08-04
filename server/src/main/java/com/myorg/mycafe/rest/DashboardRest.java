package com.myorg.mycafe.rest;

import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@PropertySource("classpath:application.properties")
@RequestMapping(path = "${endpoint.base}"+"dashboard")
public interface DashboardRest {

    @GetMapping(path = "/get/stats/count")
    ResponseEntity<Map<String, Object>> getCountStats();
}
