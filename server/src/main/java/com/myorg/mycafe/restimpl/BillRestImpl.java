package com.myorg.mycafe.restimpl;

import com.myorg.mycafe.models.Bill;
import com.myorg.mycafe.rest.BillRest;
import com.myorg.mycafe.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class BillRestImpl implements BillRest {

    @Autowired
    BillService billService;

    @Override
    public ResponseEntity<List<Bill>> getBills() {
        return billService.getBills();
    }

    @Override
    public ResponseEntity<String> generateReport(Map<String, String> requestMap) {
        return billService.generateReport(requestMap);
    }

    @Override
    public ResponseEntity<byte[]> getBillPdf(Map<String, String> requestMap) {
        return billService.getBillPdf(requestMap);
    }

    @Override
    public ResponseEntity<String> deleteBill(Integer id) {
        return billService.deleteBill(id);
    }
}
