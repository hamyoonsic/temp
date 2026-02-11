package kr.co.koreazinc.spring.http.utility;

import static org.junit.jupiter.api.Assertions.*;

import java.net.URI;

import org.junit.jupiter.api.Test;

class UriUtilsTest {

    @Test
    void toBaseURI_without_port() {
        URI uri = URI.create("https://example.com/a/b?c=d");
        assertEquals("https://example.com", UriUtils.toBaseURI(uri));
    }

    @Test
    void mutate_builds_new_uri() {
        URI uri = URI.create("http://example.com/a/b?c=d#e");
        URI mutated = UriUtils.mutate(uri)
            .scheme("https")
            .host("api.example.com")
            .port(8443)
            .build();

        assertEquals("https://api.example.com:8443/a/b?c=d#e", mutated.toString());
    }
}
