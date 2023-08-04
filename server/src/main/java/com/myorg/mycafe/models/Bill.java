package com.myorg.mycafe.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

@NamedQuery(name = "Bill.getBills", query = "SELECT b FROM Bill b ORDER BY b.id DESC")
@NamedQuery(
        name = "Bill.getBillsByUsername",
        query = "SELECT b FROM Bill b WHERE b.createdBy=:username ORDER BY b.id DESC"
)

@Data
@Entity
@DynamicInsert
@Table(name="bill")
public class Bill implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String uuid;

    @Column(length = 200)
    private String name;

    private String email;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "product_details", columnDefinition = "text")
    private String productDetails;

    @Column(name = "created_by")
    private String createdBy;

    private BigDecimal total;
}
