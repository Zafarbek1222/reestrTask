package adliya.uz.functioncatalogservice.service;

import adliya.uz.functioncatalogservice.entity.OrgFunction;
import adliya.uz.functioncatalogservice.entity.TranslatedText;
import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OrgFunctionTranslationServiceTest {

    private final OrgFunctionTranslationService service = new OrgFunctionTranslationService();

    @Test
    void removesOnlyMachineNameTranslationsWhenNameChanges() {
        Map<String, TranslatedText> nameTranslations = new LinkedHashMap<>();
        nameTranslations.put("ru", new TranslatedText("machine name", TranslatedText.MACHINE));
        nameTranslations.put("uz", new TranslatedText("human name", TranslatedText.HUMAN));
        nameTranslations.put("fr", null);
        Map<String, TranslatedText> descriptionTranslations = new LinkedHashMap<>();
        descriptionTranslations.put("ru", new TranslatedText("machine description", TranslatedText.MACHINE));

        OrgFunction function = OrgFunction.builder()
                .nameTranslations(nameTranslations)
                .descriptionTranslations(descriptionTranslations)
                .build();

        service.invalidateMachineTranslations(function, true, false);

        assertFalse(function.getNameTranslations().containsKey("ru"));
        assertEquals(nameTranslations.get("uz"), function.getNameTranslations().get("uz"));
        assertTrue(function.getNameTranslations().containsKey("fr"));
        assertSame(descriptionTranslations, function.getDescriptionTranslations());
    }

    @Test
    void removesOnlyMachineDescriptionTranslationsWhenDescriptionChanges() {
        Map<String, TranslatedText> nameTranslations = Map.of(
                "ru", new TranslatedText("machine name", TranslatedText.MACHINE)
        );
        Map<String, TranslatedText> descriptionTranslations = new LinkedHashMap<>();
        descriptionTranslations.put("ru", new TranslatedText("machine description", TranslatedText.MACHINE));
        descriptionTranslations.put("uz", new TranslatedText("human description", TranslatedText.HUMAN));

        OrgFunction function = OrgFunction.builder()
                .nameTranslations(nameTranslations)
                .descriptionTranslations(descriptionTranslations)
                .build();

        service.invalidateMachineTranslations(function, false, true);

        assertSame(nameTranslations, function.getNameTranslations());
        assertFalse(function.getDescriptionTranslations().containsKey("ru"));
        assertEquals(descriptionTranslations.get("uz"), function.getDescriptionTranslations().get("uz"));
    }

    @Test
    void initializesMissingTranslationMapWhenChanged() {
        OrgFunction function = OrgFunction.builder()
                .nameTranslations(null)
                .descriptionTranslations(null)
                .build();

        service.invalidateMachineTranslations(function, true, true);

        assertTrue(function.getNameTranslations().isEmpty());
        assertTrue(function.getDescriptionTranslations().isEmpty());
    }
}
