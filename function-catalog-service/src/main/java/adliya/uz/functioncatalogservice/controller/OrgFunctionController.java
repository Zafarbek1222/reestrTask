package adliya.uz.functioncatalogservice.controller;

import adliya.uz.functioncatalogservice.dto.UpdateRequirementsRequest;
import adliya.uz.functioncatalogservice.entity.OrgFunction;
import adliya.uz.functioncatalogservice.service.OrgFunctionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PutMapping("/{id}/requirements")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ORG_ADMIN')")
    public ResponseEntity<OrgFunction> updateRequirements(
            @PathVariable Long id, @Valid @RequestBody UpdateRequirementsRequest request) {
        return ResponseEntity.ok(orgFunctionService.updateRequirements(id, request.getRequirements()));
    }
}