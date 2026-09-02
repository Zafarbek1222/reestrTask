package adliya.uz.task1.service;

import adliya.uz.task1.dto.AddLanguageRequest;
import adliya.uz.task1.dto.LanguageCatalogItem;
import adliya.uz.task1.dto.LanguageSearchResult;
import adliya.uz.task1.entity.Language;
import adliya.uz.task1.exception.ResourceNotFoundException;
import adliya.uz.task1.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.Comparator;
import java.util.IllformedLocaleException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LanguageService {

    private static final List<Locale> AVAILABLE_LOCALES = Arrays.stream(Locale.getAvailableLocales())
            .filter(locale -> StringUtils.hasText(locale.getLanguage()))
            .filter(locale -> !"und".equalsIgnoreCase(locale.toLanguageTag()))
            .collect(Collectors.toMap(
                    Locale::toLanguageTag,
                    Function.identity(),
                    (first, ignored) -> first,
                    LinkedHashMap::new
            ))
            .values()
            .stream()
            .toList();

    private final LanguageRepository languageRepository;

    public List<LanguageCatalogItem> getCatalog() {
        return AVAILABLE_LOCALES.stream()
                .map(locale -> new LanguageCatalogItem(locale.toLanguageTag(), nativeName(locale)))
                .sorted(Comparator.comparing(LanguageCatalogItem::nameNative, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    public List<Language> getActive() {
        return languageRepository.findAllByActiveTrue();
    }

    public List<LanguageSearchResult> search(String query) {
        if (!StringUtils.hasText(query)) {
            return List.of();
        }

        String needle = query.trim().toLowerCase(Locale.ROOT);
        Set<String> addedCodes = languageRepository.findAll().stream()
                .map(Language::getCode)
                .map(code -> code.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        return AVAILABLE_LOCALES.stream()
                .map(locale -> new LanguageSearchResult(
                        locale.toLanguageTag(),
                        englishName(locale),
                        nativeName(locale),
                        addedCodes.contains(locale.toLanguageTag().toLowerCase(Locale.ROOT))
                ))
                .filter(language -> language.code().toLowerCase(Locale.ROOT).contains(needle)
                        || language.name().toLowerCase(Locale.ROOT).contains(needle)
                        || language.nativeName().toLowerCase(Locale.ROOT).contains(needle))
                .sorted(Comparator.comparing(LanguageSearchResult::name, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    @Transactional
    public Language add(AddLanguageRequest request) {
        Locale locale = parseLocale(request.code());
        String code = locale.toLanguageTag();
        if (languageRepository.existsByCodeIgnoreCase(code)) {
            throw new IllegalStateException("Language already enabled: " + code);
        }

        String requestedNativeName = request.nativeName();
        String resolvedNativeName = StringUtils.hasText(requestedNativeName)
                ? requestedNativeName.trim()
                : nativeName(locale);

        return languageRepository.save(Language.builder()
                .code(code)
                .nameNative(resolvedNativeName)
                .isDefault(false)
                .active(true)
                .build());
    }

    @Transactional
    public Language add(String rawCode) {
        return add(new AddLanguageRequest(rawCode));
    }

    @Transactional
    public void remove(Long id) {
        Language language = languageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Language not found, ID: " + id));
        if (language.isDefault()) {
            throw new IllegalStateException("The default language cannot be removed: " + language.getCode());
        }
        languageRepository.delete(language);
    }

    private Locale parseLocale(String rawCode) {
        if (!StringUtils.hasText(rawCode)) {
            throw new IllegalArgumentException("Language code is required");
        }
        try {
            Locale locale = new Locale.Builder()
                    .setLanguageTag(rawCode.trim().replace('_', '-'))
                    .build();
            if (!StringUtils.hasText(locale.getLanguage()) || "und".equalsIgnoreCase(locale.toLanguageTag())) {
                throw new IllegalArgumentException("Invalid BCP 47 language tag: " + rawCode);
            }
            if (locale.toLanguageTag().length() > 64) {
                throw new IllegalArgumentException("Language code must be at most 64 characters: " + rawCode);
            }
            return locale;
        } catch (IllformedLocaleException exception) {
            throw new IllegalArgumentException("Invalid BCP 47 language tag: " + rawCode, exception);
        }
    }

    private static String englishName(Locale locale) {
        String value = locale.getDisplayName(Locale.ENGLISH);
        return StringUtils.hasText(value) ? value : locale.toLanguageTag();
    }

    private static String nativeName(Locale locale) {
        String value = locale.getDisplayName(locale);
        if (!StringUtils.hasText(value) || value.length() > 100) {
            value = locale.getDisplayLanguage(locale);
        }
        return StringUtils.hasText(value) && value.length() <= 100
                ? value
                : locale.toLanguageTag();
    }
}
