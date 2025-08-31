package com.project.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("financial-manager")
                .pathsToMatch("/**")
                .packagesToScan("com.project.resources")
                .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info().title("Financial Manager Project")
                .description("Financial Manager Project")
                .version("1.0")
                .contact(new Contact().name("Financial Manager")
                        .url("https://github.com/josevissoti/financial-manager-project")
                        .email("financialmanagerproject@project.com.br")));
    }
}
