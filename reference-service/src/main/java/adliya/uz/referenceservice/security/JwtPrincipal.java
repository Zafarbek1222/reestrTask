package adliya.uz.referenceservice.security;

public record JwtPrincipal(String email, String role) {
    public boolean isSuperAdmin() {
        return "ROLE_SUPER_ADMIN".equals(role);
    }
}