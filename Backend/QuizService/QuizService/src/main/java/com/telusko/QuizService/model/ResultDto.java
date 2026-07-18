package com.telusko.QuizService.model;

import lombok.Data;

@Data
public class ResultDto {

    private String userEmail;
    private Integer quizId;
    private Integer score;
}
