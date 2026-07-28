package adliya.uz.task1.controller;

import adliya.uz.task1.entity.Role;
import adliya.uz.task1.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import adliya.uz.task1.dto.AssignPermissionsToRoleRequest;
import jakarta.validation.Valid;


import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        return ResponseEntity.ok(roleService.create(role));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRole(@PathVariable Long id) {
        roleService.delete(id);
        return ResponseEntity.ok("Rol o'chirildi!");
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignRole(@RequestParam Long userId, @RequestParam Long roleId) {
        String result = roleService.assignRoleToUser(userId, roleId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<Role> assignPermissions(
            @PathVariable Long id,
            @Valid @RequestBody AssignPermissionsToRoleRequest request) {
        return ResponseEntity.ok(roleService.assignPermissions(id, request.getPermissionIds()));
    }

}