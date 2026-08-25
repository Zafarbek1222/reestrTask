package adliya.uz.functioncatalogservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.UnsupportedJwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPublicKey;

@Service
public class SimpleJwtService {

    private static final String JWT_ALGORITHM = "RS256";

    private final RSAPublicKey publicKey;

    public SimpleJwtService(@Value("${jwt.public-key}") String publicKey) {
        this.publicKey = RsaPublicKeyLoader.load(publicKey);
    }

    public Claims parseClaims(String token) {
        Jws<Claims> parsedToken = Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token);

        if (!JWT_ALGORITHM.equals(parsedToken.getHeader().getAlgorithm())) {
            throw new UnsupportedJwtException("Only RS256 JWT signatures are accepted");
        }

        Claims claims = parsedToken.getPayload();
        if (!Boolean.FALSE.equals(claims.get("mustChangePassword", Boolean.class))) {
            throw new UnsupportedJwtException(
                    "JWT cannot authorize service access until the password has been changed"
            );
        }

        return claims;
    }
}

