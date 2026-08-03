package adliya.uz.referenceservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "languages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "native_name", length = 100)
    private String nativeName;

    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private boolean defaultLanguage = false;
}