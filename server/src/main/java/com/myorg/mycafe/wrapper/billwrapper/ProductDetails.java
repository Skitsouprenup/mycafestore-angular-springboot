package com.myorg.mycafe.wrapper.billwrapper;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetails {

    private String name;
    private String category;
    private String quantity;
    private String price;
    private String total;

}
