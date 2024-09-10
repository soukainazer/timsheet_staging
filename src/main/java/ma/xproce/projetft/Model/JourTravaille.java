package ma.xproce.projetft.Model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class JourTravaille {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @JsonFormat(shape = JsonFormat.Shape.STRING,pattern = "yyyy-MM-dd")
    private LocalDate date;
    private boolean hoursWorked; //1/0.5..
    private double duration;

    @Column(name = "bon_de_commande_id")
    private Integer bonDeCommandeId;


    @ManyToOne
    @JoinColumn(name= "feuilleDeTemps_Id")
    private FeuilleDeTemps feuilleDeTemps;


    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private Consultant consultant;
}
