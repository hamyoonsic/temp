package kr.co.koreazinc.app.configuration;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import kr.co.koreazinc.spring.util.OAuth;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return builder -> builder
            .serializers(
                new LocalDateTimeSerializer(dateTimeFormatter),
                new LocalDateSerializer(dateFormatter)
            )
            .deserializerByType(LocalDateTime.class, new LenientLocalDateTimeDeserializer(dateTimeFormatter))
            .deserializerByType(LocalDate.class, new LocalDateDeserializer(dateFormatter))
            .mixIn(OAuth.class, OAuthTimestampMixin.class);
    }

    public static class LenientLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
        private final DateTimeFormatter formatter;

        private LenientLocalDateTimeDeserializer(DateTimeFormatter formatter) {
            this.formatter = formatter;
        }

        @Override
        public LocalDateTime deserialize(JsonParser parser, DeserializationContext context) throws IOException {
            String value = parser.getText();
            if (value == null || value.isBlank()) {
                return null;
            }
            try {
                return LocalDateTime.parse(value, formatter);
            } catch (DateTimeParseException ex) {
                try {
                    return OffsetDateTime.parse(value).toLocalDateTime();
                } catch (DateTimeParseException ignored) {
                    return LocalDateTime.parse(value);
                }
            }
        }
    }

    private abstract static class OAuthTimestampMixin {
        @JsonDeserialize(using = LenientLocalDateTimeDeserializer.class)
        private LocalDateTime timestamp;
    }
}
