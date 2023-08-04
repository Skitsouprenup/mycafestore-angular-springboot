package com.myorg.mycafe.restimpl;

import com.myorg.mycafe.rest.ProductRest;
import com.myorg.mycafe.service.ProductService;
import com.myorg.mycafe.wrapper.productwrapper.ProductByCategory;
import com.myorg.mycafe.wrapper.productwrapper.ProductById;
import com.myorg.mycafe.wrapper.productwrapper.ProductWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ProductRestImpl implements ProductRest {

    @Autowired
    ProductService productService;

    @Override
    public ResponseEntity<String> addProduct(@RequestBody Map<String, String> requestMap) {
        System.out.println("Test: " + requestMap);
        return productService.addProduct(requestMap);
    }

    @Override
    public ResponseEntity<List<ProductWrapper>> getProducts() {
        return productService.getProducts();
    }

    @Override
    public ResponseEntity<List<ProductByCategory>> getProductsByCategory(Integer id) {
        return productService.getProductsByCategory(id);
    }

    @Override
    public ResponseEntity<ProductById> getProductById(Integer id) {
        return productService.getProductById(id);
    }

    @Override
    public ResponseEntity<String> updateProduct(Map<String, String> requestMap) {
        return productService.updateProduct(requestMap);
    }

    @Override
    public ResponseEntity<String> deleteProduct(Integer id) {
        return productService.deleteProduct(id);
    }

    @Override
    public ResponseEntity<String> updateProductStatus(Map<String, String> requestMap) {
        return productService.updateProductStatus(requestMap);
    }
}
