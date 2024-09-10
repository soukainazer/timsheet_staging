package ma.xproce.projetft.Service.Impl;

import lombok.RequiredArgsConstructor;
import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Model.Role;
import ma.xproce.projetft.Model.Users;
import ma.xproce.projetft.Model.dto.UsersRegistrationDTO;
import ma.xproce.projetft.Repository.ConsultantRepo;
import ma.xproce.projetft.Repository.UsersRepo;
import ma.xproce.projetft.Service.UsersService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersServiceImpl implements UsersService {

    private final UsersRepo usersRepo;
    private final ConsultantRepo consultantRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Users registerUser(UsersRegistrationDTO usersRegistrationDTO) {
        Users user = new Users();
        user.setEmail(usersRegistrationDTO.getEmail());
        user.setMotDePasse(passwordEncoder.encode(usersRegistrationDTO.getMotDePasse()));
        user.setRole(Role.valueOf(usersRegistrationDTO.getRole()));

        Users savedUser = usersRepo.save(user);

        if ("CONSULTANT".equals(usersRegistrationDTO.getRole())) {
            Consultant consultant = new Consultant();
            consultant.setNom(usersRegistrationDTO.getNom());
            consultant.setPrenom(usersRegistrationDTO.getPrenom());
            consultant.setTelephone(usersRegistrationDTO.getTelephone());
            consultant.setAdresse(usersRegistrationDTO.getAdresse());
            consultant.setEmail(usersRegistrationDTO.getEmail());
            consultant.setNationalite(usersRegistrationDTO.getNationalite());
            consultant.setSexe(usersRegistrationDTO.getSexe());
            consultant.setDateNaissance(usersRegistrationDTO.getDateNaissance());
            consultant.setSituationFamiliale(usersRegistrationDTO.getSituationFamiliale());
            consultant.setLieuResidence(usersRegistrationDTO.getLieuResidence());
            consultant.setService(usersRegistrationDTO.getService());
            consultant.setFonction(usersRegistrationDTO.getFonction());
            consultant.setCoordonnees(usersRegistrationDTO.getCoordonnees());

            consultant.setUser(savedUser);
            consultantRepo.save(consultant);
        }

        return savedUser;
    }
}
