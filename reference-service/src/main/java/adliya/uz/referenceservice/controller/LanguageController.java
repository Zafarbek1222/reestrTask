package adliya.uz.referenceservice.controller;

import adliya.uz.referenceservice.dto.AddLanguageRequest;
import adliya.uz.referenceservice.dto.LanguageSearchResult;
import adliya.uz.referenceservice.entity.Language;
import adliya.uz.referenceservice.service.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    // Публичный список — им пользуется переключатель языка на фронте
    @GetMapping
    public ResponseEntity<List<Language>> getAll() {
        return ResponseEntity.ok(languageService.getAll());
    }

    // Поиск по всем языкам мира — только для админки
    @GetMapping("/search")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<LanguageSearchResult>> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(languageService.search(query));
    }

    // Добавить выбранный язык в интерфейс
    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Language> add(@RequestBody AddLanguageRequest request) {
        return ResponseEntity.ok(languageService.addLanguage(request.code()));
    }

    // Убрать язык из интерфейса (default-языки убрать нельзя)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        languageService.removeLanguage(id);
        return ResponseEntity.noContent().build();
    }
}