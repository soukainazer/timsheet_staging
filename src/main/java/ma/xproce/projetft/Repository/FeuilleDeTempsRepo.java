package ma.xproce.projetft.Repository;

import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Model.FeuilleDeTemps;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FeuilleDeTempsRepo extends JpaRepository<FeuilleDeTemps, Integer> {



    Optional<FeuilleDeTemps> findById(Integer id);


List<FeuilleDeTemps> findByConsultantIdAndYearAndMonth(int consultantId, Integer year, Integer month);

    Optional<FeuilleDeTemps> findByConsultantIdAndYearAndMonthAndBcId(int consultantId, int year, int month, int bcId);
}
