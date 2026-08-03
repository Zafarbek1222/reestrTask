package adliya.uz.referenceservice.config;

import adliya.uz.referenceservice.entity.Language;
import adliya.uz.referenceservice.entity.Region;
import adliya.uz.referenceservice.repository.LanguageRepository;
import adliya.uz.referenceservice.repository.RegionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private record RegionSeed(String name, String code) {}
    private record LanguageSeed(String code, String name, String nativeName) {}

    private final RegionRepository regionRepository;
    private final LanguageRepository languageRepository;

    public DataInitializer(RegionRepository regionRepository, LanguageRepository languageRepository) {
        this.regionRepository = regionRepository;
        this.languageRepository = languageRepository;
    }

    @Override
    public void run(String... args) {
        seedRegions();
        seedLanguages();
    }

    private void seedRegions() {
        List<RegionSeed> seeds = List.of(
                new RegionSeed("Tashkent", "1700"),
                new RegionSeed("Samarkand", "1706"),
                new RegionSeed("Khorezm", "1710"),
                new RegionSeed("Bukhara", "1703"),
                new RegionSeed("Fergana", "1707")
        );

        for (RegionSeed seed : seeds) {
            if (!regionRepository.existsByCode(seed.code())) {
                Region region = Region.builder()
                        .name(seed.name())
                        .code(seed.code())
                        .build();
                regionRepository.save(region);
            }
        }
    }

    private void seedLanguages() {
        List<LanguageSeed> seeds = List.of(
                new LanguageSeed("en", "English", "English"),
                new LanguageSeed("ru", "Russian", "Русский"),
                new LanguageSeed("uz", "Uzbek", "Oʻzbekcha")
        );

        for (LanguageSeed seed : seeds) {
            if (!languageRepository.existsByCode(seed.code())) {
                Language language = Language.builder()
                        .code(seed.code())
                        .name(seed.name())
                        .nativeName(seed.nativeName())
                        .defaultLanguage(true)
                        .build();
                languageRepository.save(language);
            }
        }
    }
}