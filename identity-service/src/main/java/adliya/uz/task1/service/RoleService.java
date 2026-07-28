package adliya.uz.task1.service;

import adliya.uz.task1.entity.Permission;
import adliya.uz.task1.entity.Role;
import adliya.uz.task1.entity.User;
import adliya.uz.task1.repository.RoleRepository;
import adliya.uz.task1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PermissionService permissionService;

    public List<Role> getAll() {
        return roleRepository.findAll();
    }

    public Role getById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol topilmadi, ID: " + id));
    }

    public Role create(Role role) {
        String roleName = role.getName().toUpperCase();
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }
        role.setName(roleName);
        return roleRepository.save(role);
    }

    public void delete(Long id) {
        Role role = getById(id);
        roleRepository.delete(role);
    }

    public String assignRoleToUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Foydalanuvchi topilmadi, ID: " + userId));
        Role role = getById(roleId);

        user.setRole(role);
        userRepository.save(user);

        return user.getEmail() + " foydalanuvchisiga " + role.getName() + " roli muvaffaqiyatli biriktirildi!";
    }

    public Role getByName(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Rol topilmadi, nomi: " + roleName));
    }

    @Transactional
    public Role assignPermissions(Long roleId, Set<Long> permissionIds) {
        Role role = getById(roleId);

        Set<Permission> permissions = permissionIds.stream()
                .map(permissionService::getById)
                .collect(Collectors.toCollection(HashSet::new));

        role.setPermissions(permissions);
        return roleRepository.save(role);
    }
}
