package com.myorg.mycafe.service;

import com.myorg.mycafe.models.Category;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface CategoryService {
    ResponseEntity<String> addCategory(Map<String, String> requestMap);

    ResponseEntity<List<Category>> getCategories(String filterValue);

    ResponseEntity<String> updateCategory(Map<String, String> requestMap);
}
