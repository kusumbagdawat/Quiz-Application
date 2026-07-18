package com.telusko.question_service.service;
import com.telusko.question_service.Dao.QuestionDao;
import com.telusko.question_service.model.Question;
import com.telusko.question_service.model.QuestionWrapper;
import com.telusko.question_service.model.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    QuestionDao questionDao;


    public ResponseEntity<List<Question>> getAllQuestions() {
        try{
            return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);

        }catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<List<Question>> getQuestionsByCategory(String category) {
        try{
            return new ResponseEntity<>(questionDao.findAll(), HttpStatus.OK);

        }catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<String> addQuestion(Question question) {
        questionDao.save(question);
        return new ResponseEntity<>("success",HttpStatus.CREATED);
    }

    public ResponseEntity<List<Integer>> getQuestionsForQuiz(String categoryName, Integer numQuestions) {
        List<Integer> questions=questionDao.findRandomQuestionsByCategory(categoryName,numQuestions);
        return new ResponseEntity<>(questions, HttpStatus.OK);

    }

    public ResponseEntity<List<QuestionWrapper>> getQuestionsFromId(List<Integer> questionsIds) {
        List<QuestionWrapper> wrappers = new ArrayList<>();
        List<Question> questions = new ArrayList<>();

        for(Integer id : questionsIds){
            questions.add(questionDao.findById(id).get());
        }
        for (Question question : questions){
            QuestionWrapper wrapper = new QuestionWrapper();
            wrapper.setId(question.getId());
            wrapper.setQuestion(question.getQuestion());
            wrapper.setOption1(question.getOption1());
            wrapper.setOption2(question.getOption2());
            wrapper.setOption3(question.getOption3());
            wrapper.setOption4(question.getOption4());
            wrappers.add(wrapper);
        }

        return new ResponseEntity<>(wrappers,HttpStatus.OK);
    }
    public  ResponseEntity<Integer> getScore(List<Response> responses) {

        int right = 0;

        for (Response response : responses) {
            Question question = questionDao.findById(response.getId()).get();
            if (response.getResponse().equals(question.getRightAnswer()))
                right++;
        }
        return new ResponseEntity<>(right,HttpStatus.OK);
    }
    public ResponseEntity<String> updateQuestion(
            Integer id,
            Question updatedQuestion) {

        Question question =
                questionDao.findById(id)
                        .orElse(null);

        if(question == null){
            return new ResponseEntity<>(
                    "Question Not Found",
                    HttpStatus.NOT_FOUND
            );
        }

        question.setQuestion(
                updatedQuestion.getQuestion()
        );

        question.setOption1(
                updatedQuestion.getOption1()
        );

        question.setOption2(
                updatedQuestion.getOption2()
        );

        question.setOption3(
                updatedQuestion.getOption3()
        );

        question.setOption4(
                updatedQuestion.getOption4()
        );

        question.setRightAnswer(
                updatedQuestion.getRightAnswer()
        );

        question.setCategory(
                updatedQuestion.getCategory()
        );

        question.setDifficultyLevel(
                updatedQuestion.getDifficultyLevel()
        );

        questionDao.save(question);

        return new ResponseEntity<>(
                "Question Updated Successfully",
                HttpStatus.OK
        );
    }

    public ResponseEntity<String> deleteQuestion(
            Integer id) {

        questionDao.deleteById(id);

        return new ResponseEntity<>(
                "Question Deleted Successfully",
                HttpStatus.OK
        );
    }
}