package ma.xproce.projetft.Service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Model.dto.ConsultantDTO;
import ma.xproce.projetft.Model.dto.UsersRegistrationDTO;
import ma.xproce.projetft.Repository.ConsultantRepo;
import ma.xproce.projetft.Repository.UsersRepo;
import ma.xproce.projetft.Service.ConsultantService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultantServiceImpl implements ConsultantService {

    private final ConsultantRepo consultantRepo;
    private final PasswordEncoder passwordEncoder;
    private final UsersRepo usersRepo;

    @Override
    public ConsultantDTO getConsultantById(int consultantId) {
        Consultant consultant = consultantRepo.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Consultant not found"));
        return mapConsultantToDTO(consultant);
    }

    @Override
    public List<ConsultantDTO> getAllConsultants() {
        List<Consultant> consultants = consultantRepo.findAll();
        return consultants.stream()
                .map(this::mapConsultantToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Consultant updateIdErp(int consultantId, String idErp){
            Consultant consultant= consultantRepo.findById(consultantId).orElseThrow(() -> new RuntimeException("Consultant not found"));
            consultant.setIdErp(idErp);
            return consultantRepo.save(consultant);

    }


    @Override
    public void deleteConsultant(Consultant consultant) {
        consultantRepo.delete(consultant);
    }

    @Override
    public Consultant updateConsultant(int consultantId, Consultant consultant) {
        return consultantRepo.findById(consultantId).map(existingConsultant -> {
            existingConsultant.setNom(consultant.getNom());
            existingConsultant.setPrenom(consultant.getPrenom());
            existingConsultant.setEmail(consultant.getEmail());
            existingConsultant.setDateNaissance(consultant.getDateNaissance());
            existingConsultant.setSexe(consultant.getSexe());
            existingConsultant.setNationalite(consultant.getNationalite());
            existingConsultant.setSituationFamiliale(consultant.getSituationFamiliale());
            existingConsultant.setLieuResidence(consultant.getLieuResidence());
            existingConsultant.setAdresse(consultant.getAdresse());
            existingConsultant.setService(consultant.getService());
            existingConsultant.setFonction(consultant.getFonction());
            existingConsultant.setCoordonnees(consultant.getCoordonnees());

            return consultantRepo.save(existingConsultant);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id: " + consultantId));
    }


    private ConsultantDTO mapConsultantToDTO(Consultant consultant) {
        ConsultantDTO dto = new ConsultantDTO();
        dto.setId(consultant.getId());
        dto.setNom(consultant.getNom());
        dto.setPrenom(consultant.getPrenom());
        dto.setEmail(consultant.getEmail());
        dto.setIdErp(consultant.getIdErp());
        dto.setTelephone(consultant.getTelephone());
        dto.setNationalite(consultant.getNationalite());
        dto.setDateNaissance(consultant.getDateNaissance());
        dto.setSexe(consultant.getSexe());
        dto.setSituationFamiliale(consultant.getSituationFamiliale());
        dto.setLieuResidence(consultant.getLieuResidence());
        dto.setAdresse(consultant.getAdresse());
        dto.setService(consultant.getService());
        dto.setFonction(consultant.getFonction());
        dto.setCoordonnees(consultant.getCoordonnees());
        return dto;
    }
}
