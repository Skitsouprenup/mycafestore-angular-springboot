package com.myorg.mycafe.service;

import com.myorg.mycafe.models.Bill;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface BillService {
    ResponseEntity<String> generateReport(Map<String, String> requestMap);

    ResponseEntity<List<Bill>> getBills();

    ResponseEntity<byte[]> getBillPdf(Map<String, String> requestMap);

    ResponseEntity<String> deleteBill(Integer id);
}
