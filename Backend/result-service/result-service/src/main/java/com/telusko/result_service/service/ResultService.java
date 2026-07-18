package com.telusko.result_service.service;

import com.telusko.result_service.model.Result;
import com.telusko.result_service.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResultService {
    @Autowired
    private ResultRepository resultRepository;

    public Result saveResult(Result result){
        result.setAttemptDate(LocalDateTime.now());

        return resultRepository.save(result);
    }
    public List<Result> getUserResults(String email) {
        return resultRepository.findByUserEmail(email);
    }

    public List<Result> getAllresults() {
        return resultRepository.findAll();
    }
}
