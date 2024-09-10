package ma.xproce.projetft.Model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtAuthenticationResponse  {
    private String accessToken;
    private String tokenType = "Bearer";
    private String email;
    private Integer consultantId;
    private String role;
    private String idErp;

    public JwtAuthenticationResponse(String accessToken, String email, Integer consultantId, String role, String idErp) {
        this.accessToken = accessToken;
        this.email = email;
        this.consultantId = consultantId;
        this.role = role;
        this.idErp = idErp;

    }
}
