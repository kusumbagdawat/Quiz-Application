package com.telusko.auth_service.service;

import com.telusko.auth_service.dto.AdminRegisterRequest;
import com.telusko.auth_service.dto.LoginRequest;
import com.telusko.auth_service.dto.LoginResponse;
import com.telusko.auth_service.dto.RegisterRequest;
import com.telusko.auth_service.model.User;
import com.telusko.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String registerAdmin(
            AdminRegisterRequest request){

        if(userRepository.findByEmail(
                        request.getEmail())
                .isPresent()){

            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole("ROLE_ADMIN");

        userRepository.save(user);

        return "Admin Registered Successfully";
    }

    public String register(RegisterRequest request){
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            return "Email already exists";
        }
        User user=new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String encodedPassword =
                passwordEncoder.encode(request.getPassword());

        System.out.println("Encoded Password : " + encodedPassword);

        user.setPassword(encodedPassword);

        user.setRole("ROLE_USER");

        userRepository.save(user);

        return "User Registered Successfully";
    }
//    public LoginResponse login(LoginRequest request){
//
//        User user = userRepository
//                .findByEmail(request.getEmail())
//                .orElse(null);
//
//        if(user == null){
//            return new LoginResponse("User Not Found");
//        }
//
//        boolean matched =
//                passwordEncoder.matches(
//                        request.getPassword(),
//                        user.getPassword()
//                );
//
//        if(matched){
//
//            String token =
//                    jwtService.generateToken(
//                            user.getEmail(),
//                            user.getRole()
//                    );
//
//            return new LoginResponse(token);
//        }
//
//        return new LoginResponse("Invalid Password");
//    }

    public LoginResponse login(LoginRequest request){

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if(user == null){
            System.out.println("USER NOT FOUND");
            return new LoginResponse("User Not Found");
        }

        System.out.println("EMAIL = " + request.getEmail());
        System.out.println("ENTERED PASSWORD = " + request.getPassword());
        System.out.println("DB PASSWORD = " + user.getPassword());

        boolean matched =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        System.out.println("MATCHED = " + matched);

        if(matched){

            String token =
                    jwtService.generateToken(
                            user.getEmail(),
                            user.getRole()
                    );

            return new LoginResponse(token);
        }

        return new LoginResponse("Invalid Password");
    }
}
