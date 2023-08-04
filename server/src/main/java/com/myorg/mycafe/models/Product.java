package com.myorg.mycafe.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

@NamedQuery(
        name = "Product.getProductsByCategory",
        query = "SELECT new com.myorg.mycafe.wrapper.productwrapper.ProductByCategory"+
                "(p.id, p.name) FROM Product p "+
                "WHERE p.category.id=:id AND p.status='true'"
)

@NamedQuery(
        name = "Product.getProductById",
        query = "SELECT new com.myorg.mycafe.wrapper.productwrapper.ProductById"+
                "(p.id, p.name, p.description, p.price) FROM Product p "+
                "WHERE p.id=:id AND p.status='true'"
)

@NamedQuery(
        name = "Product.getProducts",
        query = "SELECT new com.myorg.mycafe.wrapper.productwrapper.ProductWrapper"+
                "(p.id, p.name, p.description, p.price, p.status,"+
                " p.category.id, p.category.name) FROM Product p"
)

@Data
@Entity
@DynamicInsert
@Table(name="product")
public class Product implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;

    @Column(length = 200)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_fk", nullable = false)
    private Category category;

    private String description;
    private BigDecimal price;
    private String status;
}
