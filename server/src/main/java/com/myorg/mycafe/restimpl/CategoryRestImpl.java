package com.myorg.mycafe.restimpl;

import com.myorg.mycafe.models.Category;
import com.myorg.mycafe.rest.CategoryRest;
import com.myorg.mycafe.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class CategoryRestImpl implements CategoryRest {

    @Autowired
    CategoryService categoryService;

    @Override
    public ResponseEntity<List<Category>> getCategories(String filterValue) {
        return categoryService.getCategories(filterValue);
    }

    @Override
    public ResponseEntity<String> addCategory(Map<String, String> requestMap) {
        return categoryService.addCategory(requestMap);
    }

    @Override
    public ResponseEntity<String> updateCategory(Map<String, String> requestMap) {
        return categoryService.updateCategory(requestMap);
    }
}
