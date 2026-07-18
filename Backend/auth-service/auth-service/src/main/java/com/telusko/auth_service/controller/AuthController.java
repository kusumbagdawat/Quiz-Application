package com.telusko.auth_service.controller;

import com.telusko.auth_service.dto.AdminRegisterRequest;
import com.telusko.auth_service.dto.LoginRequest;
import com.telusko.auth_service.dto.LoginResponse;
import com.telusko.auth_service.dto.RegisterRequest;
import com.telusko.auth_service.service.AuthService;
import jakarta.persistence.GeneratedValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return authService.register(request);
    }
    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request){

        return authService.login(request);
    }
    @PostMapping("/register-admin")
    public String registerAdmin(
            @RequestBody
            AdminRegisterRequest request){

        return authService
                .registerAdmin(request);
    }
    @GetMapping("/hello")
    public String hello(){

        return "Hello Authenticated User";
    }
}

