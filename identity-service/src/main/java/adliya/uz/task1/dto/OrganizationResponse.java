package adliya.uz.task1.dto;

import adliya.uz.task1.entity.Organization;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean enabled;
    private LocalDateTime createdAt;

    public static OrganizationResponse from(Organization org) {
        return OrganizationResponse.builder()
                .id(org.getId())
                .name(org.getName())
                .description(org.getDescription())
                .enabled(org.getEnabled())
                .createdAt(org.getCreatedAt())
                .build();
    }
}
