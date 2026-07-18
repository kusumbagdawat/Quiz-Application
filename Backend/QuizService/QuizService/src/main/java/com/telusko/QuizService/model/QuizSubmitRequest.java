package com.telusko.QuizService.model;

import lombok.Data;

import java.util.List;

@Data
public class QuizSubmitRequest {
    private String userEmail;
    private List<Response> responses;
}
