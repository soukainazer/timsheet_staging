package ma.xproce.projetft.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Users {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Consultant consultant;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Admin admin;
}
