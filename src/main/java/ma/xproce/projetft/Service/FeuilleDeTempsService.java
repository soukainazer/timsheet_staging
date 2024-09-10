package ma.xproce.projetft.Service;

import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Model.FeuilleDeTemps;
import ma.xproce.projetft.Model.JourTravaille;
import ma.xproce.projetft.Model.dto.FeuilleDeTempsDTO;
import ma.xproce.projetft.Model.dto.WorkedDays;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface FeuilleDeTempsService {




//    FeuilleDeTemps getOrCreateFeuilleDeTempsForMonth (int consultantId, int year, int month);

    List<FeuilleDeTemps> getTimesheetsByConsultantAndPeriod(int consultantId, int year, int month);

    FeuilleDeTemps getOrCreateFeuilleDeTempsForMonthAndBC(int consultantId, int year, int month, int bcId);

//    JourTravaille addTimeSheetDay (int consultantId, LocalDate date);




    void bulkAddFeuilleDeTempsDays(int consultantId,
                                   int year, int month,
                                   List<WorkedDays.WorkedDayDto> workedDays,
                                   Map<Integer, MultipartFile > pieceJointe);


    List<FeuilleDeTempsDTO> getAllFeuilleDeTemps();




    FeuilleDeTempsDTO getFeuilleDeTempsDTOById(int id);


//    FeuilleDeTempsDTO getFeuilleDeTemps(int id, Integer year, Integer month);

    void deleteFeuilleDeTemps(int id);




    FeuilleDeTemps validerFeuilleDeTemps(int id);



    void rejeterFeuilleDeTemps(int timesheetId, String reason);

    FeuilleDeTempsDTO convertToDTO(FeuilleDeTemps feuilleDeTemps);
}
