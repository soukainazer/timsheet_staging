package ma.xproce.projetft.Repository;

import ma.xproce.projetft.Model.Consultant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultantRepo extends JpaRepository<Consultant, Integer> {
    Consultant findByEmail(String email);
}
