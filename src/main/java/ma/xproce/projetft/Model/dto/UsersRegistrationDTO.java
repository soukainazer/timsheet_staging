package ma.xproce.projetft.Model.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;


import java.time.LocalDate;

@Data
public class UsersRegistrationDTO {
    private int consultantId;
    private String nom;
    private String prenom;
    private String email;

    @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters.")
    private String motDePasse;
    private String confirmPassword;
    private String telephone;
    private String nationalite;
    private LocalDate dateNaissance;
    private String sexe;
    private String situationFamiliale;
    private String lieuResidence;
    private String adresse;
    private String service;
    private String fonction;
    private String coordonnees;
    private String role;
}
