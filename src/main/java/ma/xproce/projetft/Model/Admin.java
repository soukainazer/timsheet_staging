package ma.xproce.projetft.Model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Admin extends Users{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Users user;
}
