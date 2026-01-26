package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.app.dto.notice.NoticeSignatureDto;
import kr.co.koreazinc.temp.model.entity.notice.NoticeSignature;
import kr.co.koreazinc.temp.repository.notice.NoticeSignatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeSignatureService {
    private final NoticeSignatureRepository signatureRepository;

    @Transactional(readOnly = true)
    public List<NoticeSignatureDto> getSignatures(String userId) {
        return signatureRepository.findByUserIdOrderByUpdatedAtDesc(userId)
            .stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NoticeSignatureDto getDefaultSignature(String userId) {
        return signatureRepository.findByUserIdAndIsDefaultTrue(userId)
            .map(this::toDto)
            .orElse(null);
    }

    @Transactional
    public NoticeSignatureDto createSignature(String userId, NoticeSignatureDto dto) {
        NoticeSignature signature = NoticeSignature.builder()
            .userId(userId)
            .name(dto.getName())
            .content(dto.getContent())
            .isDefault(Boolean.TRUE.equals(dto.getIsDefault()))
            .build();
        if (Boolean.TRUE.equals(signature.getIsDefault())) {
            signatureRepository.clearDefaultByUserId(userId);
        }
        return toDto(signatureRepository.save(signature));
    }

    @Transactional
    public NoticeSignatureDto updateSignature(Long signatureId, String userId, NoticeSignatureDto dto) {
        NoticeSignature signature = signatureRepository.findById(signatureId)
            .orElseThrow(() -> new IllegalArgumentException("signature not found"));
        if (!signature.getUserId().equals(userId)) {
            throw new IllegalArgumentException("signature owner mismatch");
        }
        signature.setName(dto.getName());
        signature.setContent(dto.getContent());
        if (dto.getIsDefault() != null) {
            signature.setIsDefault(dto.getIsDefault());
            if (Boolean.TRUE.equals(dto.getIsDefault())) {
                signatureRepository.clearDefaultByUserId(userId);
                signature.setIsDefault(true);
            }
        }
        return toDto(signatureRepository.save(signature));
    }

    @Transactional
    public void deleteSignature(Long signatureId, String userId) {
        NoticeSignature signature = signatureRepository.findById(signatureId)
            .orElseThrow(() -> new IllegalArgumentException("signature not found"));
        if (!signature.getUserId().equals(userId)) {
            throw new IllegalArgumentException("signature owner mismatch");
        }
        signatureRepository.delete(signature);
    }

    private NoticeSignatureDto toDto(NoticeSignature signature) {
        return NoticeSignatureDto.builder()
            .signatureId(signature.getSignatureId())
            .userId(signature.getUserId())
            .name(signature.getName())
            .content(signature.getContent())
            .isDefault(signature.getIsDefault())
            .build();
    }
}
