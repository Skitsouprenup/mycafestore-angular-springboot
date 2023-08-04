package com.myorg.mycafe.dao;

import com.myorg.mycafe.models.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface BillDao extends JpaRepository<Bill, Long> {
    List<Bill> getBills();
    List<Bill> getBillsByUsername(@Param("username") String currentUser);
}
