package adliya.uz.functioncatalogservice.controller;

import adliya.uz.functioncatalogservice.entity.OrgFunction;
import adliya.uz.functioncatalogservice.service.OrgFunctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/functions")
@RequiredArgsConstructor
public class OrgFunctionController {

    private final OrgFunctionService orgFunctionService;

    @GetMapping
    public ResponseEntity<List<OrgFunction>> getAll(
            @RequestParam(required = false) Long organizationId,
            @RequestParam(required = false) String category) {
        if (organizationId != null) {
            return ResponseEntity.ok(orgFunctionService.getByOrganizationId(organizationId));
        }
        if (category != null) {
            return ResponseEntity.ok(orgFunctionService.getByCategory(category));
        }
        return ResponseEntity.ok(orgFunctionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrgFunction> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orgFunctionService.getById(id));
    }
}
