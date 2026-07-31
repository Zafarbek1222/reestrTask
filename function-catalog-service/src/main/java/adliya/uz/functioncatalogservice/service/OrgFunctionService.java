package adliya.uz.functioncatalogservice.service;

import adliya.uz.functioncatalogservice.entity.OrgFunction;
import adliya.uz.functioncatalogservice.repository.OrgFunctionRepository;
import adliya.uz.functioncatalogservice.security.JwtPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class OrgFunctionService {

    private final OrgFunctionRepository orgFunctionRepository;

    public List<OrgFunction> getAll() {
        return orgFunctionRepository.findAll();
    }

    public OrgFunction getById(Long id) {
        return orgFunctionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Function not found, ID: " + id));
    }

    public List<OrgFunction> getByOrganizationId(Long organizationId) {
        return orgFunctionRepository.findAllByOrganizationId(organizationId);
    }

    public List<OrgFunction> getByCategory(String category) {
        return orgFunctionRepository.findAllByCategory(category);
    }

    public OrgFunction updateRequirements(Long id, String requirements) {
        OrgFunction function = getById(id);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        JwtPrincipal principal = (JwtPrincipal) authentication.getPrincipal();

        if (!principal.isSuperAdmin() && !principal.organizationIds().contains(function.getOrganizationId())) {
            throw new AccessDeniedException(
                    "You can only edit functions within your own organization(s)");
        }

        function.setRequirements(requirements);
        return orgFunctionRepository.save(function);
    }
}
