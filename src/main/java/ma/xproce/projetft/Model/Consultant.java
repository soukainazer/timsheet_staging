package ma.xproce.projetft.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Data

public class Consultant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @OneToMany(mappedBy = "consultant")
    private List<FeuilleDeTemps> feuillesDeTemps;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Users user;

    @OneToMany(mappedBy = "consultant")
    private List<JourTravaille> jourTravailles;




}
