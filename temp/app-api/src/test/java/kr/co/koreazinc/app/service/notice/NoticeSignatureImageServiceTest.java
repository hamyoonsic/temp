package kr.co.koreazinc.app.service.notice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import kr.co.koreazinc.app.configuration.NoticeSignatureStorageProperty;
import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.temp.repository.notice.NoticeSignatureImageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

class NoticeSignatureImageServiceTest {

    private NoticeSignatureImageService service;

    private NoticeSignatureImageRepository repository = mock(NoticeSignatureImageRepository.class);
    private OAuth2Property oauth2Property = mock(OAuth2Property.class);
    private NoticeSignatureStorageProperty storageProperty = new NoticeSignatureStorageProperty();

    @BeforeEach
    void setUp() {
        service = new NoticeSignatureImageService(repository, oauth2Property, storageProperty);
    }

    @Test
    void downloadImage_throws_when_missing() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.downloadImage(1L));
    }
}
