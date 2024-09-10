package ma.xproce.projetft.Model.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ConsultantDTO {

    private int id;
    private String nom;
    private String prenom;
    private String adresse;
    private String telephone;
    private String email;
    private String nationalite;
    private String sexe;
    private LocalDate dateNaissance;
    private String situationFamiliale;
    private String lieuResidence;
    private String service;
    private String fonction;
    private String coordonnees;
    private String idErp;
}
