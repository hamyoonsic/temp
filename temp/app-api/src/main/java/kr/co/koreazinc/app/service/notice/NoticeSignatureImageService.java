package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.app.configuration.NoticeSignatureStorageProperty;
import kr.co.koreazinc.spring.model.FileInfo;
import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.spring.utility.FileUtils;
import kr.co.koreazinc.temp.model.entity.notice.NoticeSignatureImage;
import kr.co.koreazinc.temp.repository.notice.NoticeSignatureImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeSignatureImageService {
    private final NoticeSignatureImageRepository imageRepository;
    private final OAuth2Property oauth2Property;
    private final NoticeSignatureStorageProperty storageProperty;

    @Transactional
    public NoticeSignatureImage uploadImage(String userId, MultipartFile file) {
        log.info(" 서명 이미지 업로드 시작: userId={}, fileName={}", userId, file.getOriginalFilename());

        try {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFileName = UUID.randomUUID().toString() + extension;

            FileInfo fileInfo = FileInfo.builder()
                .file(file.getInputStream())
                .system(storageProperty.getSystemName())
                .corporation(storageProperty.getCorporationName())
                .path(storageProperty.getUploadPath() + "/" + userId)
                .name(savedFileName)
                .size(file.getSize())
                .build();

            FileInfo uploadedFile = FileUtils.remoteUpload(oauth2Property.getCredential("file"), fileInfo);

            NoticeSignatureImage image = NoticeSignatureImage.builder()
                .userId(userId)
                .fileName(savedFileName)
                .fileOriginalName(originalFilename)
                .filePath(uploadedFile.getPath() + uploadedFile.getName())
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .build();

            return imageRepository.save(image);
        } catch (IOException e) {
            log.error(" 서명 이미지 업로드 실패: userId={}, error={}", userId, e.getMessage(), e);
            throw new RuntimeException("서명 이미지 업로드 실패: " + e.getMessage(), e);
        }
    }

    public InputStream downloadImage(Long imageId) {
        NoticeSignatureImage image = imageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("서명 이미지가 없습니다: " + imageId));

        String filePath = image.getFilePath();
        int lastSlash = filePath.lastIndexOf('/');
        String path = lastSlash > -1 ? filePath.substring(0, lastSlash) : "";
        String name = lastSlash > -1 ? filePath.substring(lastSlash + 1) : filePath;

        FileInfo fileInfo = FileInfo.builder()
            .system(storageProperty.getSystemName())
            .corporation(storageProperty.getCorporationName())
            .path(path)
            .name(name)
            .build();

        try {
            return FileUtils.remoteDownload(oauth2Property.getCredential("file"), fileInfo);
        } catch (IOException e) {
            log.error(" 서명 이미지 다운로드 실패: imageId={}, error={}", imageId, e.getMessage(), e);
            throw new RuntimeException("서명 이미지 다운로드 실패: " + e.getMessage(), e);
        }
    }
}
