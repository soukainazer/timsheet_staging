package ma.xproce.projetft.Repository;

import ma.xproce.projetft.Model.FeuilleDeTemps;
import ma.xproce.projetft.Model.JourTravaille;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JourTravailleRepo extends JpaRepository<JourTravaille, Integer> {

    List<JourTravaille> findByFeuilleDeTemps(FeuilleDeTemps feuilleDeTemps);
}
