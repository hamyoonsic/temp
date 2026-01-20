package kr.co.koreazinc.spring.security.authorization;

import java.io.IOException;

import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import reactor.core.publisher.Mono;

public class BasicAuthenticationEntryPoint {

    // 원본 파일 
    // @Component
    // @ConditionalOnWebApplication(type = Type.SERVLET)
    // public static class ServletEntryPoint implements AuthenticationEntryPoint {

    //     @Override
    //     public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
    //         throw exception;
    //     }
    // }

    // @Component
    // @ConditionalOnWebApplication(type = Type.REACTIVE)
    // public static class ReactiveReactiveHandler implements ServerAuthenticationEntryPoint {

    //     @Override
    //     public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException exception) {
    //         throw exception;
    //     }
    // }

    //토큰 만료 리다이렉트 관련 수정본 
    @Component
    @ConditionalOnWebApplication(type = Type.SERVLET)
    public static class ServletEntryPoint implements AuthenticationEntryPoint {

        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) 
                throws IOException, ServletException {
            
            // 수정: 401 Unauthorized 반환
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setHeader("WWW-Authenticate", "Bearer");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            
            // 에러 메시지 추출
            String errorMessage = exception.getMessage();
            if (errorMessage == null || errorMessage.isEmpty()) {
                errorMessage = "인증이 필요합니다.";
            }
            
            // JSON 응답 생성
            String jsonResponse = String.format(
                "{\"success\": false, \"message\": \"%s\", \"errorCode\": \"UNAUTHORIZED\"}",
                escapeJson(errorMessage)
            );
            
            response.getWriter().write(jsonResponse);
        }
        
        /**
         * JSON 문자열 이스케이프 처리
         */
        private String escapeJson(String text) {
            if (text == null) return "";
            return text.replace("\"", "\\\"")
                        .replace("\n", "\\n")
                        .replace("\r", "\\r")
                        .replace("\t", "\\t");
        }
    }

    @Component
    @ConditionalOnWebApplication(type = Type.REACTIVE)
    public static class ReactiveReactiveHandler implements ServerAuthenticationEntryPoint {

        @Override
        public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException exception) {
            // 수정: Reactive 환경에서도 401 반환
            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
            exchange.getResponse().getHeaders().add("WWW-Authenticate", "Bearer");
            exchange.getResponse().getHeaders().setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            
            String errorMessage = exception.getMessage();
            if (errorMessage == null || errorMessage.isEmpty()) {
                errorMessage = "인증이 필요합니다.";
            }
            
            String jsonResponse = String.format(
                "{\"success\": false, \"message\": \"%s\", \"errorCode\": \"UNAUTHORIZED\"}",
                errorMessage.replace("\"", "\\\"")
            );
            
            byte[] bytes = jsonResponse.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            org.springframework.core.io.buffer.DataBuffer buffer = 
                exchange.getResponse().bufferFactory().wrap(bytes);
            
            return exchange.getResponse().writeWith(reactor.core.publisher.Mono.just(buffer));
        }
    }
}