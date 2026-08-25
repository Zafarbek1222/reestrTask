package adliya.uz.task1.config.security;

import adliya.uz.task1.entity.Organization;
import adliya.uz.task1.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    private static final String JWT_ALGORITHM = "RS256";

    private final JwtProperties jwtProperties;
    private RSAPrivateKey privateKey;
    private RSAPublicKey publicKey;

    @PostConstruct
    public void init() {
        privateKey = RsaKeyLoader.loadPrivateKey(jwtProperties.getPrivateKey());
        publicKey = RsaKeyLoader.loadPublicKey(jwtProperties.getPublicKey());
        RsaKeyLoader.requireMatchingPair(privateKey, publicKey);
    }

    public String generateToken(User user) {
        List<Long> organizationIds = user.getOrganizations().stream()
                .map(Organization::getId)
                .toList();

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().getName())
                .claim("organizationIds", organizationIds)
                .claim("mustChangePassword", Boolean.TRUE.equals(user.getMustChangePassword()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        Jws<Claims> parsedToken = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token);

        if (!JWT_ALGORITHM.equals(parsedToken.getHeader().getAlgorithm())) {
            throw new UnsupportedJwtException("Only RS256 JWT signatures are accepted");
        }

        return parsedToken.getPayload();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
