package adliya.uz.functioncatalogservice.service;

import adliya.uz.functioncatalogservice.entity.OrgFunction;
import adliya.uz.functioncatalogservice.entity.TranslatedText;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class OrgFunctionTranslationService {

    public void invalidateMachineTranslations(OrgFunction function, boolean nameChanged, boolean descriptionChanged) {
        if (nameChanged) {
            function.setNameTranslations(withoutMachineTranslations(function.getNameTranslations()));
        }
        if (descriptionChanged) {
            function.setDescriptionTranslations(withoutMachineTranslations(function.getDescriptionTranslations()));
        }
    }

    private Map<String, TranslatedText> withoutMachineTranslations(Map<String, TranslatedText> translations) {
        if (translations == null || translations.isEmpty()) {
            return new LinkedHashMap<>();
        }

        Map<String, TranslatedText> preserved = new LinkedHashMap<>();
        translations.forEach((languageCode, translatedText) -> {
            if (translatedText == null || !TranslatedText.MACHINE.equals(translatedText.source())) {
                preserved.put(languageCode, translatedText);
            }
        });
        return preserved;
    }
}
