package com.myorg.mycafe.rest;

import com.myorg.mycafe.models.Category;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@PropertySource("classpath:application.properties")
@RequestMapping(path = "${endpoint.base}"+"categories")
public interface CategoryRest {

    @GetMapping(path = "/get/all")
    ResponseEntity<List<Category>> getCategories(@RequestParam(required = false) String filterValue);

    @PostMapping(path = "/add")
    ResponseEntity<String> addCategory(@RequestBody Map<String, String> requestMap);

    @PutMapping(path = "/update")
    ResponseEntity<String> updateCategory(@RequestBody Map<String, String> requestMap);



}
