package com.myorg.mycafe.wrapper.productwrapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductById {

    private Integer id;
    private String name;
    private String description;
    private BigDecimal price;

}
