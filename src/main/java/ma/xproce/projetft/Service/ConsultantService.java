package ma.xproce.projetft.Service;

import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Model.dto.ConsultantDTO;
import ma.xproce.projetft.Model.dto.UsersRegistrationDTO;

import java.util.List;

public interface ConsultantService {


    ConsultantDTO getConsultantById(int consultantId);

    List<ConsultantDTO> getAllConsultants();


    Consultant updateIdErp(int consultantId, String idErp);

    void deleteConsultant(Consultant consultant);

    Consultant updateConsultant(int consultantId, Consultant consultant);
}
