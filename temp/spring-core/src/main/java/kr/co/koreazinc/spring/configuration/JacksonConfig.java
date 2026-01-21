package kr.co.koreazinc.spring.configuration;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.openapitools.jackson.nullable.JsonNullableModule;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import kr.co.koreazinc.spring.jackson.serializer.HttpMethodSerializer;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer customizer() {
        return builder->{
            builder.serializationInclusion(JsonInclude.Include.ALWAYS);
            builder.featuresToDisable(
                SerializationFeature.FAIL_ON_EMPTY_BEANS,
                SerializationFeature.WRITE_DATES_AS_TIMESTAMPS,
                DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES
            );
            // Serializer
            builder.serializerByType(HttpMethod.class, new HttpMethodSerializer());
            builder.serializers(new LocalDateSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            builder.serializers(new LocalDateTimeSerializer(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            // Deserializer
            builder.deserializers(new LocalDateDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            builder.deserializerByType(LocalDateTime.class, new LenientLocalDateTimeDeserializer());
            // Module
            builder.modules(new JsonNullableModule(), new JavaTimeModule());
        };
    }

    static class LenientLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
        private static final DateTimeFormatter SPACE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        private static final DateTimeFormatter T_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        @Override
        public LocalDateTime deserialize(JsonParser parser, DeserializationContext context) throws IOException {
            String value = parser.getText();
            if (value == null || value.isBlank()) {
                return null;
            }
            try {
                return LocalDateTime.parse(value, SPACE_FORMATTER);
            } catch (DateTimeParseException ex) {
                try {
                    return LocalDateTime.parse(value, T_FORMATTER);
                } catch (DateTimeParseException ignored) {
                    try {
                        return OffsetDateTime.parse(value).toLocalDateTime();
                    } catch (DateTimeParseException fallback) {
                        return LocalDateTime.parse(value);
                    }
                }
            }
        }
    }
}
