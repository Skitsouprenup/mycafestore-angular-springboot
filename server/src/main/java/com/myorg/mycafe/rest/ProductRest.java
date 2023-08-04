package com.myorg.mycafe.rest;

import com.myorg.mycafe.wrapper.productwrapper.ProductByCategory;
import com.myorg.mycafe.wrapper.productwrapper.ProductById;
import com.myorg.mycafe.wrapper.productwrapper.ProductWrapper;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@PropertySource("classpath:application.properties")
@RequestMapping(path = "${endpoint.base}"+"products")
public interface ProductRest {

    @PostMapping(path = "/add")
    ResponseEntity<String> addProduct(Map<String, String> requestMap);

    @GetMapping(path = "/get/all")
    ResponseEntity<List<ProductWrapper>> getProducts();

    @GetMapping(path = "/get/category/{id}")
    ResponseEntity<List<ProductByCategory>> getProductsByCategory(@PathVariable Integer id);

    @GetMapping(path = "/get/product/{id}")
    ResponseEntity<ProductById> getProductById(@PathVariable Integer id);

    @PutMapping(path = "/update")
    ResponseEntity<String> updateProduct(@RequestBody Map<String, String> requestMap);

    @DeleteMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteProduct(@PathVariable Integer id);

    @PatchMapping(path = "update/status")
    ResponseEntity<String> updateProductStatus(@RequestBody Map<String, String> requestMap);
}
