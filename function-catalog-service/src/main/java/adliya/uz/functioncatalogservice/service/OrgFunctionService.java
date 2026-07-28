package adliya.uz.functioncatalogservice.service;

import adliya.uz.functioncatalogservice.entity.OrgFunction;
import adliya.uz.functioncatalogservice.repository.OrgFunctionRepository;
import lombok.RequiredArgsConstructor;
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
}
