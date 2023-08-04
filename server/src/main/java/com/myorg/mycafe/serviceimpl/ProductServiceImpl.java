package com.myorg.mycafe.serviceimpl;

import com.myorg.mycafe.constants.CafeConstants;
import com.myorg.mycafe.dao.CategoryDao;
import com.myorg.mycafe.dao.ProductDao;
import com.myorg.mycafe.jwt.JwtFilter;
import com.myorg.mycafe.models.Category;
import com.myorg.mycafe.models.Product;
import com.myorg.mycafe.service.ProductService;
import com.myorg.mycafe.utils.CafeUtilities;
import com.myorg.mycafe.wrapper.productwrapper.ProductByCategory;
import com.myorg.mycafe.wrapper.productwrapper.ProductById;
import com.myorg.mycafe.wrapper.productwrapper.ProductWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    ProductDao productDao;

    @Autowired
    CategoryDao categoryDao;

    @Autowired
    JwtFilter jwtFilter;

    @Override
    public ResponseEntity<String> addProduct(Map<String, String> requestMap) {
        try {
            if(jwtFilter.hasRole("admin")) {
                if(CafeUtilities.validateRequestMapIdAndName(requestMap, false)) {
                    Product savedProduct =
                            productDao.save(
                                    Objects.requireNonNull(getProductFromMap(requestMap, false))
                            );

                    String responseBody =
                             "{\"categoryId\": \""+ savedProduct.getCategory().getId() +"\", "
                            +"\"categoryName\": \""+ savedProduct.getCategory().getName() +"\", "
                            +"\"description\": \""+ savedProduct.getDescription() +"\", "
                            +"\"id\": \""+ savedProduct.getId() +"\", "
                            +"\"name\": \""+ savedProduct.getName() +"\", "
                            +"\"price\": \""+ savedProduct.getPrice().toString() +"\", "
                            +"\"status\": \""+ savedProduct.getStatus() +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
                }
                String responseBody = "{\"message\": \""+ "Invalid Data." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
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
    public ResponseEntity<List<ProductWrapper>> getProducts() {
        try {
            return new ResponseEntity<>(productDao.getProducts(), HttpStatus.OK);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateProduct(Map<String, String> requestMap) {
        try {
            if(jwtFilter.hasRole("admin")) {
                if(CafeUtilities.validateRequestMapIdAndName(requestMap, true)) {
                    Optional<Product> opt =
                            productDao.findById(Integer.parseInt(requestMap.get("id")));

                    if(opt.isPresent()) {
                        Product product = getProductFromMap(requestMap, true);
                        Objects.requireNonNull(product).setStatus(opt.get().getStatus());
                        Product editedProduct = productDao.save(product);

                        String responseBody =
                                "{\"categoryId\": \""+ editedProduct.getCategory().getId() +"\", "
                                        +"\"categoryName\": \""+ editedProduct.getCategory().getName() +"\", "
                                        +"\"description\": \""+ editedProduct.getDescription() +"\", "
                                        +"\"id\": \""+ editedProduct.getId() +"\", "
                                        +"\"name\": \""+ editedProduct.getName() +"\", "
                                        +"\"price\": \""+ editedProduct.getPrice().toString() +"\", "
                                        +"\"status\": \""+ editedProduct.getStatus() +"\"}";
                        return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
                    }
                    else {
                        String responseBody = "{\"message\": \""+ "Product ID doesn't exist." +"\"}";
                        return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
                    }
                }
                String responseBody = "{\"message\": \""+ "Invalid Data." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
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
    public ResponseEntity<String> deleteProduct(Integer id) {
        try {
            if(jwtFilter.hasRole("admin")) {
                Optional<Product> productOpt = productDao.findById(id);

                if(productOpt.isPresent()) {
                    productDao.deleteById(id);

                    String responseBody = "{\"message\": \""+ "Product Deleted." +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
                }
                else {
                    String responseBody = "{\"message\": \""+ "Product ID doesn't exist." +"\"}";
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
    public ResponseEntity<String> updateProductStatus(Map<String, String> requestMap) {
        try {
            if(jwtFilter.hasRole("admin")) {
                Optional<Product> productOpt = productDao.findById(Integer.parseInt(requestMap.get("id")));

                if(productOpt.isPresent()) {
                    productOpt.get().setStatus(requestMap.get("status"));
                    productDao.save(productOpt.get());

                    String responseBody = "{\"message\": \""+ "Product Status Updated." +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.OK);
                }
                else {
                    String responseBody = "{\"message\": \""+ "Product ID doesn't exist." +"\"}";
                    return CafeUtilities.getResponse(responseBody, HttpStatus.BAD_REQUEST);
                }
            }
            else {
                String responseBody = "{\"message\": \""+ "Unauthorized Access." +"\"}";
                return CafeUtilities.getResponse(responseBody, HttpStatus.UNAUTHORIZED);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        String responseBody = "{\"message\": \""+ CafeConstants.STATUS_500 +"\"}";
        return CafeUtilities.getResponse(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<ProductByCategory>> getProductsByCategory(Integer id) {
        try {
            return new ResponseEntity<>(productDao.getProductsByCategory(id), HttpStatus.OK);
        }
        catch(Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<ProductById> getProductById(Integer id) {
        try {
            ProductById product = productDao.getProductById(id);
            if(product != null) return new ResponseEntity<>(product, HttpStatus.OK);
            else return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        catch(Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private Product getProductFromMap(Map<String, String> requestMap, boolean updateProduct) {
        Optional<Category> opt = categoryDao.findById(Integer.parseInt(requestMap.get("categoryId")));

        if(opt.isEmpty()) {
            log.error("Optional opt in 'getProductFromMap' method is null!");
            return null;
        }

        Category category = opt.get();
        Product product = new Product();
        product.setCategory(category);

        //This is executed if the category already exists in the database
        //and going to be updated.
        if(updateProduct) product.setId(Integer.parseInt(requestMap.get("id")));
        else product.setStatus("true");
        product.setName(requestMap.get("name"));
        product.setDescription(requestMap.get("description"));
        try {
            product.setPrice(new BigDecimal(requestMap.get("price")));
        } catch(Exception e) {e.printStackTrace();}

        return product;
    }
}
