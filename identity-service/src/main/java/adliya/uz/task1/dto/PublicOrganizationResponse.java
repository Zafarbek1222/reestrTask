package adliya.uz.task1.dto;

import adliya.uz.task1.entity.Organization;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicOrganizationResponse {
    private Long id;
    private String name;
    private String description;

    public static PublicOrganizationResponse from(Organization org) {
        return PublicOrganizationResponse.builder()
                .id(org.getId())
                .name(org.getName())
                .description(org.getDescription())
                .build();
    }
}
