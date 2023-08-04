package com.myorg.mycafe.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;

import java.io.Serial;
import java.io.Serializable;

@NamedQuery(
        name = "Category.getCategories",
        query = "SELECT c FROM Category c where c.id IN (SELECT p.category FROM Product p"
                +" WHERE p.status='true')"
)

@Data
@Entity
@DynamicInsert
@Table(name="category")
public class Category implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Integer id;

    @Column(length = 200)
    private String name;
}
