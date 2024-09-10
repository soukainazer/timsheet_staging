package ma.xproce.projetft.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class FeuilleDeTemps {


    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Lob
    @Column(name = "piece_jointe")
    private byte[] pieceJointe;
    private String statut;
    private String rejectionReason;
    private double totalJoursT;
    private int year;
    private int month;
    private int bcId;

    @OneToMany(mappedBy = "feuilleDeTemps", cascade = CascadeType.ALL)
    private List<JourTravaille> jourTravaille;

    @ManyToOne
    @JoinColumn(name = "consultant_id")
    private Consultant consultant;





}
