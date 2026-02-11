package kr.co.koreazinc.spring.advice;

import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.koreazinc.spring.exception.NotValidException;
import kr.co.koreazinc.spring.http.enhancer.HttpEnhancer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
public class GlobalRestExceptionAdvice {

    @RestControllerAdvice(annotations = RestController.class)
    @Order(Ordered.LOWEST_PRECEDENCE + 1)
    @ConditionalOnWebApplication(type = Type.SERVLET)
    @RequiredArgsConstructor
    public static class GlobalExceptionServletAdvice {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public void handle(HttpServletRequest request, HttpServletResponse response, MethodArgumentNotValidException exception) throws ServletException {
            HttpEnhancer.create(request, response).forward(new NotValidException(exception), HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException exception) throws ServletException {
            HttpEnhancer.create(request, response).forward(exception, HttpStatus.FORBIDDEN);
        }

        @ExceptionHandler(WebExchangeBindException.class)
        public void handle(HttpServletRequest request, HttpServletResponse response, WebExchangeBindException exception) throws ServletException {
            HttpEnhancer.create(request, response).forward(new NotValidException(exception), HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ResponseStatusException.class)
        public void handle(HttpServletRequest request, HttpServletResponse response, ResponseStatusException exception) throws ServletException {
            HttpEnhancer.create(request, response).forward(exception, exception.getStatusCode());
        }

        @ExceptionHandler(Exception.class)
        public void handle(HttpServletRequest request, HttpServletResponse response, Exception exception) throws ServletException {
            String errorId = java.util.UUID.randomUUID().toString();
            String correlationId = java.util.Optional.ofNullable(request.getHeader("X-Correlation-Id")).orElse(java.util.UUID.randomUUID().toString());
            org.slf4j.MDC.put("errorId", errorId);
            org.slf4j.MDC.put("correlationId", correlationId);
            request.setAttribute("errorId", errorId);
            request.setAttribute("correlationId", correlationId);
            try {
                log.error("Unhandled exception (servlet rest-advice), errorId={}, correlationId={}", errorId, correlationId, exception);
                HttpEnhancer.create(request, response).forward(exception, HttpStatus.INTERNAL_SERVER_ERROR);
            } finally {
                org.slf4j.MDC.clear();
            }
        }
    }

    @RestControllerAdvice(annotations = RestController.class)
    @Order(Ordered.LOWEST_PRECEDENCE + 1)
    @ConditionalOnWebApplication(type = Type.REACTIVE)
    @RequiredArgsConstructor
    public static class GlobalExceptionReactiveAdvice {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public Mono<Void> handle(ServerWebExchange exchange, MethodArgumentNotValidException exception) {
            return HttpEnhancer.create(exchange).forward(new NotValidException(exception), HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public Mono<Void> handle(ServerWebExchange exchange, AccessDeniedException exception) {
            return HttpEnhancer.create(exchange).forward(exception, HttpStatus.FORBIDDEN);
        }

        @ExceptionHandler(WebExchangeBindException.class)
        public Mono<Void> handle(ServerWebExchange exchange, WebExchangeBindException exception) {
            return HttpEnhancer.create(exchange).forward(new NotValidException(exception), HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ResponseStatusException.class)
        public Mono<Void> handle(ServerWebExchange exchange, ResponseStatusException exception) {
            return HttpEnhancer.create(exchange).forward(exception, exception.getStatusCode());
        }

        @ExceptionHandler(Exception.class)
        public Mono<Void> handle(ServerWebExchange exchange, Exception exception) {
            String errorId = java.util.UUID.randomUUID().toString();
            String correlationId = java.util.Optional.ofNullable(exchange.getRequest().getHeaders().getFirst("X-Correlation-Id")).orElse(java.util.UUID.randomUUID().toString());
            exchange.getRequest().getAttributes().put("errorId", errorId);
            exchange.getRequest().getAttributes().put("correlationId", correlationId);
            log.error("Unhandled exception (reactive rest-advice), errorId={}, correlationId={}", errorId, correlationId, exception);
            return HttpEnhancer.create(exchange).forward(exception, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}