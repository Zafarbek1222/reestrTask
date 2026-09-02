package adliya.uz.task1.config.security;

import adliya.uz.task1.entity.Organization;
import adliya.uz.task1.entity.Role;
import adliya.uz.task1.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {
    private static final String SECRET = "ApeVFjUOyTmk7XYwgcYwIEsix1mALAsQhftYQqWHE8P6kcnqbZv0Uxj9HduKEvjXzz0sVYCG0ZjSBtmxadtAiQ==";

    @Test
    void generatesAndValidatesHmacTokenWithExistingClaims() {
        JwtService service = service();
        User user = User.builder().email("admin@example.com")
                .role(Role.builder().name("ROLE_SUPER_ADMIN").build())
                .organizations(Set.of(Organization.builder().id(10L).build(), Organization.builder().id(20L).build()))
                .mustChangePassword(true).build();

        String token = service.generateToken(user);
        var parsed = Jwts.parser().verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .build().parseSignedClaims(token);

        assertThat(parsed.getHeader().getAlgorithm()).isEqualTo("HS256");
        assertThat(parsed.getPayload().getSubject()).isEqualTo("admin@example.com");
        assertThat(parsed.getPayload().get("role", String.class)).isEqualTo("ROLE_SUPER_ADMIN");
        assertThat(parsed.getPayload().get("organizationIds", java.util.List.class)).containsExactlyInAnyOrder(10, 20);
        assertThat(parsed.getPayload().get("mustChangePassword", Boolean.class)).isTrue();
        assertThat(service.extractUsername(token)).isEqualTo("admin@example.com");
    }

    private static JwtService service() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret(SECRET);
        properties.setExpiration(60_000L);
        properties.setRefreshExpiration(120_000L);
        JwtService service = new JwtService(properties);
        service.init();
        return service;
    }
}
