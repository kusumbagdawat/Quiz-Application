package com.telusko.result_service.repository;

import com.telusko.result_service.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result,Integer> {
    List<Result> findByUserEmail(String userEmail);
}
