package com.telusko.QuizService.service;


import com.telusko.QuizService.Dao.QuizDao;
import com.telusko.QuizService.feign.QuizInterface;
import com.telusko.QuizService.feign.ResultInterface;
import com.telusko.QuizService.model.QuestionWrapper;
import com.telusko.QuizService.model.Quiz;
import com.telusko.QuizService.model.QuizSubmitRequest;
import com.telusko.QuizService.model.ResultDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuizService {
    @Autowired
    QuizDao quizDao;

    @Autowired
    QuizInterface quizInterface;

    @Autowired
    private ResultInterface resultInterface;

    public ResponseEntity<String> createQuiz(String category, int numQ, String title) {

        List<Integer> questions = quizInterface.getQuestionsForQuiz(category, numQ).getBody();
        Quiz quiz=new Quiz();
        quiz.setTitle(title);
        quiz.setQuestionIds(questions);
        quizDao.save(quiz);

        return new ResponseEntity<>("success", HttpStatus.CREATED);
    }


    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(Integer id) {
      Quiz quiz = quizDao.findById(id).get();
      List<Integer>questionIds=quiz.getQuestionIds();
      quizInterface.getQuestionsFromId(questionIds);
      ResponseEntity<List<QuestionWrapper>>questions=quizInterface.getQuestionsFromId(questionIds);
      return questions;
    }
    public ResponseEntity<List<Quiz>> getAllQuizzes() {

        List<Quiz> quizzes = quizDao.findAll();

        return new ResponseEntity<>(
                quizzes,
                HttpStatus.OK
        );
    }

    public ResponseEntity<Integer> calculateResult(
            Integer id,
            QuizSubmitRequest request) {

        ResponseEntity<Integer> scoreResponse =
                quizInterface.getScore(
                        request.getResponses()
                );

        Integer score = scoreResponse.getBody();

        ResultDto resultDto = new ResultDto();

        resultDto.setUserEmail(
                request.getUserEmail()
        );

        resultDto.setQuizId(id);

        resultDto.setScore(score);

        resultInterface.saveResult(resultDto);

        return new ResponseEntity<>(
                score,
                HttpStatus.OK
        );
    }
}
