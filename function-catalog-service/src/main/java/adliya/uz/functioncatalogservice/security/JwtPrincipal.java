package adliya.uz.functioncatalogservice.security;

import java.util.List;

public record JwtPrincipal(String email, String role, List<Long> organizationIds) {
    public boolean isSuperAdmin() {
        return "ROLE_SUPER_ADMIN".equals(role);
    }
}
