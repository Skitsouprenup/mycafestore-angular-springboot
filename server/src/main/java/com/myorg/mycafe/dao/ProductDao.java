package com.myorg.mycafe.dao;

import com.myorg.mycafe.models.Product;
import com.myorg.mycafe.wrapper.productwrapper.ProductByCategory;
import com.myorg.mycafe.wrapper.productwrapper.ProductById;
import com.myorg.mycafe.wrapper.productwrapper.ProductWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductDao extends JpaRepository<Product, Integer> {

    List<ProductWrapper> getProducts();

    List<ProductByCategory> getProductsByCategory(@Param("id") Integer id);

    ProductById getProductById(@Param("id") Integer id);
}
