package com.project.financialmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@EntityScan(basePackages = {"com.project.domains", "com.project.domains.enums"})
@SpringBootApplication
public class FinancialManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinancialManagerApplication.class, args);
	}

}

