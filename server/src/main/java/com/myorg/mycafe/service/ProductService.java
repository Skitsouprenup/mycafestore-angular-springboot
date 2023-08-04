package com.myorg.mycafe.service;

import com.myorg.mycafe.wrapper.productwrapper.ProductByCategory;
import com.myorg.mycafe.wrapper.productwrapper.ProductById;
import com.myorg.mycafe.wrapper.productwrapper.ProductWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ProductService {
    ResponseEntity<String> addProduct(Map<String, String> requestMap);

    ResponseEntity<List<ProductWrapper>> getProducts();

    ResponseEntity<String> updateProduct(Map<String, String> requestMap);

    ResponseEntity<String> deleteProduct(Integer id);

    ResponseEntity<String> updateProductStatus(Map<String, String> requestMap);

    ResponseEntity<List<ProductByCategory>> getProductsByCategory(Integer id);

    ResponseEntity<ProductById> getProductById(Integer id);
}
