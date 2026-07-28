package adliya.uz.task1.service;

import adliya.uz.task1.dto.CreateOrgAdminRequest;
import adliya.uz.task1.dto.PromoteToOrgAdminRequest;
import adliya.uz.task1.dto.UpdateOrgAdminRequest;
import adliya.uz.task1.entity.Organization;
import adliya.uz.task1.entity.Role;
import adliya.uz.task1.entity.User;
import adliya.uz.task1.exception.EmailAlreadyExistsException;
import adliya.uz.task1.exception.ResourceNotFoundException;
import adliya.uz.task1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private static final String ORG_ADMIN_ROLE = "ROLE_ORG_ADMIN";

    private final UserRepository userRepository;
    private final OrganizationService organizationService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User createOrgAdmin(CreateOrgAdminRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(
                    "User with this email already exists: " + request.getEmail());
        }

        Organization org = organizationService.getById(request.getOrganizationId());
        Role orgAdminRole = roleService.getByName(ORG_ADMIN_ROLE);

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(orgAdminRole)
                .build();

        user.getOrganizations().add(org);

        return userRepository.save(user);
    }

    @Transactional
    public User promoteToOrgAdmin(PromoteToOrgAdminRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found, ID: " + request.getUserId()));

        Organization org = organizationService.getById(request.getOrganizationId());
        Role orgAdminRole = roleService.getByName(ORG_ADMIN_ROLE);

        user.setRole(orgAdminRole);
        user.getOrganizations().add(org);

        return userRepository.save(user);
    }

    public List<User> getAllOrgAdmins() {
        return userRepository.findAllByRole_Name(ORG_ADMIN_ROLE);
    }

    public User getOrgAdminById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found, ID: " + id));
        requireRole(user, ORG_ADMIN_ROLE);
        return user;
    }

    @Transactional
    public User updateOrgAdmin(Long id, UpdateOrgAdminRequest request) {
        User user = getOrgAdminById(id);

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        if (request.getOrganizationId() != null) {
            Organization org = organizationService.getById(request.getOrganizationId());
            user.getOrganizations().clear();
            user.getOrganizations().add(org);
        }

        if (request.getEnabled() != null) user.setEnabled(request.getEnabled());

        return userRepository.save(user);
    }

    @Transactional
    public void deactivateOrgAdmin(Long id) {
        User user = getOrgAdminById(id);
        user.setEnabled(false);
        userRepository.save(user);
    }

    private void requireRole(User user, String expectedRole) {
        if (!expectedRole.equals(user.getRole().getName())) {
            throw new ResourceNotFoundException(
                    "User with ID " + user.getId() + " is not a " + expectedRole);
        }
    }
}

