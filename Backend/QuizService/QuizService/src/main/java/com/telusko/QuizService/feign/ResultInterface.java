package com.telusko.QuizService.feign;

import com.telusko.QuizService.model.ResultDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("RESULT-SERVICE")
public interface ResultInterface {

    @PostMapping("/result/save")
    ResultDto saveResult(
            @RequestBody ResultDto resultDto
    );
}
