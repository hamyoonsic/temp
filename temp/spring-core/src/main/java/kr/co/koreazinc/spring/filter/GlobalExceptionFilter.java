package kr.co.koreazinc.spring.filter;

import java.io.IOException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.koreazinc.spring.http.enhancer.HttpEnhancer;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
public class GlobalExceptionFilter {

    @Component
    @ConditionalOnWebApplication(type = Type.SERVLET)
    public static class GlobalExceptionServletFilter extends OncePerRequestFilter
            implements Ordered {

        private HttpStatus resolveStatus(Exception exception) {
            if (exception instanceof AuthenticationException) {
                if (exception instanceof InsufficientAuthenticationException) {
                    return HttpStatus.UNAUTHORIZED;
                } else if (exception instanceof AccessDeniedException) {
                    return HttpStatus.FORBIDDEN;
                } else {
                    return HttpStatus.BAD_REQUEST;
                }
            } else {
                return HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                FilterChain filterChain) throws ServletException, IOException {
            try {
                filterChain.doFilter(request, response);
            } catch (Exception exception) {
                String errorId = java.util.UUID.randomUUID().toString();
                String correlationId = java.util.Optional.ofNullable(request.getHeader("X-Correlation-Id")).orElse(java.util.UUID.randomUUID().toString());
                org.slf4j.MDC.put("errorId", errorId);
                org.slf4j.MDC.put("correlationId", correlationId);
                request.setAttribute("errorId", errorId);
                request.setAttribute("correlationId", correlationId);
                try {
                    log.error("Unhandled servlet exception, errorId={}, correlationId={}", errorId, correlationId, exception);
                    HttpEnhancer.create(request, response).forward(exception, resolveStatus(exception));
                } finally {
                    org.slf4j.MDC.clear();
                }
            }
        }

        @Override
        public int getOrder() {
            return Ordered.HIGHEST_PRECEDENCE;
        }
    }

    @Component
    @ConditionalOnWebApplication(type = Type.REACTIVE)
    public static class GlobalExceptionReactiveFilter implements WebFilter, Ordered {

        @Override
        public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
            return chain.filter(exchange).onErrorResume(exception -> {
                String errorId = java.util.UUID.randomUUID().toString();
                String correlationId = java.util.Optional.ofNullable(exchange.getRequest().getHeaders().getFirst("X-Correlation-Id")).orElse(java.util.UUID.randomUUID().toString());
                exchange.getRequest().getAttributes().put("errorId", errorId);
                exchange.getRequest().getAttributes().put("correlationId", correlationId);
                // log with explicit ids (reactive context may not preserve MDC)
                log.error("Unhandled reactive exception, errorId={}, correlationId={}", errorId, correlationId, exception);
                return HttpEnhancer.create(exchange).forward(exception, HttpStatus.INTERNAL_SERVER_ERROR);
            });
        }

        @Override
        public int getOrder() {
            return Ordered.HIGHEST_PRECEDENCE;
        }
    }
}
