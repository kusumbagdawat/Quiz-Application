package com.telusko.result_service.controller;

import com.telusko.result_service.model.Result;
import com.telusko.result_service.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/result")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @PostMapping("/save")
    public Result saveResult(
            @RequestBody Result result) {

        return resultService.saveResult(result);
    }

    @GetMapping("/user/{email}")
    public List<Result> getUserResults(
            @PathVariable String email) {

        return resultService.getUserResults(email);
    }

    @GetMapping("/all")
    public List<Result> getAllResults() {

        return resultService.getAllresults();
    }
}
