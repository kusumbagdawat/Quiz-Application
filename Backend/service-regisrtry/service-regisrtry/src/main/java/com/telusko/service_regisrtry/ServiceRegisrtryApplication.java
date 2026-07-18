package com.telusko.service_regisrtry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class ServiceRegisrtryApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceRegisrtryApplication.class, args);
	}

}
