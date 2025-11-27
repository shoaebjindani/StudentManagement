package com.shoaeb;

import java.io.IOException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import java.awt.Desktop;
import java.net.URI;
import java.net.URISyntaxException;

@ServletComponentScan
@SpringBootApplication
public class SpringBootServletJspApplication {

	public static void main(String[] args) throws IOException, URISyntaxException {
		SpringApplication.run(SpringBootServletJspApplication.class, args);

    
		
	}

	
	

}
