package com.myorg.mycafe.rest;

import com.myorg.mycafe.models.Bill;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@PropertySource("classpath:application.properties")
@RequestMapping(path = "${endpoint.base}"+"bills")
public interface BillRest {

    @GetMapping(path = "/get")
    ResponseEntity<List<Bill>> getBills();

    @PostMapping(path = "/generate/report")
    ResponseEntity<String> generateReport(@RequestBody Map<String, String> requestMap);

    @PostMapping(path = "/retrieve/report")
    ResponseEntity<byte[]> getBillPdf(@RequestBody Map<String, String> requestMap);

    @DeleteMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteBill(@PathVariable Integer id);
}
