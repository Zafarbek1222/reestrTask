package adliya.uz.referenceservice.catalog;

import java.util.*;
import java.util.stream.Collectors;


public final class WorldLanguageCatalog {

    private static final Locale RU = Locale.forLanguageTag("ru");
    private static final Locale UZ = Locale.forLanguageTag("uz");

    private static final List<LanguageOption> ALL = build();

    private WorldLanguageCatalog() {
    }

    public static List<LanguageOption> all() {
        return ALL;
    }

    public static Optional<LanguageOption> byCode(String code) {
        if (code == null) {
            return Optional.empty();
        }
        return ALL.stream()
                .filter(l -> l.code().equalsIgnoreCase(code))
                .findFirst();
    }

    public static List<LanguageOption> search(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        String needle = query.trim().toLowerCase(Locale.ROOT);
        return ALL.stream()
                .filter(l -> matches(l, needle))
                .toList();
    }

    private static boolean matches(LanguageOption l, String needle) {
        return l.code().toLowerCase(Locale.ROOT).contains(needle)
                || l.nameEn().toLowerCase(Locale.ROOT).contains(needle)
                || l.nameRu().toLowerCase(Locale.ROOT).contains(needle)
                || l.nameUz().toLowerCase(Locale.ROOT).contains(needle)
                || l.nativeName().toLowerCase(Locale.ROOT).contains(needle);
    }

    private static List<LanguageOption> build() {
        return Arrays.stream(Locale.getISOLanguages())
                .map(WorldLanguageCatalog::toOption)
                .sorted(Comparator.comparing(LanguageOption::nameEn))
                .collect(Collectors.toUnmodifiableList());
    }

    private static LanguageOption toOption(String code) {
        Locale locale = Locale.forLanguageTag(code);
        return new LanguageOption(
                code,
                capitalize(locale.getDisplayLanguage(Locale.ENGLISH)),
                capitalize(locale.getDisplayLanguage(RU)),
                capitalize(locale.getDisplayLanguage(UZ)),
                capitalize(locale.getDisplayLanguage(locale))
        );
    }

    private static String capitalize(String s) {
        if (s == null || s.isBlank()) {
            return s;
        }
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}