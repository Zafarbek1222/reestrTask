package adliya.uz.referenceservice.service;

import adliya.uz.referenceservice.catalog.LanguageOption;
import adliya.uz.referenceservice.catalog.WorldLanguageCatalog;
import adliya.uz.referenceservice.dto.LanguageSearchResult;
import adliya.uz.referenceservice.entity.Language;
import adliya.uz.referenceservice.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private final LanguageRepository languageRepository;

    public List<Language> getAll() {
        return languageRepository.findAll();
    }

    public List<LanguageSearchResult> search(String query) {
        Set<String> addedCodes = languageRepository.findAll().stream()
                .map(Language::getCode)
                .collect(Collectors.toSet());

        return WorldLanguageCatalog.search(query).stream()
                .map(option -> new LanguageSearchResult(
                        option.code(),
                        option.nameEn(),
                        option.nativeName(),
                        addedCodes.contains(option.code())
                ))
                .toList();
    }

    public Language addLanguage(String code) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException("Language code must not be blank");
        }

        LanguageOption option = WorldLanguageCatalog.byCode(code)
                .orElseThrow(() -> new NoSuchElementException("Unknown ISO-639-1 language code: " + code));

        if (languageRepository.existsByCode(option.code())) {
            throw new IllegalStateException("Language already added: " + option.code());
        }

        Language language = Language.builder()
                .code(option.code())
                .name(option.nameEn())
                .nativeName(option.nativeName())
                .defaultLanguage(false)
                .build();

        return languageRepository.save(language);
    }

    public void removeLanguage(Long id) {
        Language language = languageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Language not found, ID: " + id));

        if (language.isDefaultLanguage()) {
            throw new IllegalStateException("Default interface language cannot be removed: " + language.getCode());
        }

        languageRepository.delete(language);
    }
}