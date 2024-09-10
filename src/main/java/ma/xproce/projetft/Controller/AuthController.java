package ma.xproce.projetft.Controller;

import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Model.Role;
import ma.xproce.projetft.Model.Users;
import ma.xproce.projetft.Model.dto.JwtAuthenticationResponse;
import ma.xproce.projetft.Model.dto.LoginDTO;
import ma.xproce.projetft.Model.dto.UsersRegistrationDTO;
import ma.xproce.projetft.Repository.ConsultantRepo;
import ma.xproce.projetft.Repository.UsersRepo;
import ma.xproce.projetft.Security.JwtTokenProvider;
import ma.xproce.projetft.Service.ConsultantService;
import ma.xproce.projetft.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")

public class AuthController {





    @Autowired
    private  UsersService usersService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private ConsultantRepo consultantRepo;

    @PostMapping("/login")
    public JwtAuthenticationResponse login(@RequestBody LoginDTO loginRequest) {

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getMotDePasse()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenProvider.generateToken(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//           String email = userDetails.getUsername();
//            int consultantId = consultantRepo.findByEmail(email).getId();
            //return new JwtAuthenticationResponse(jwt,email,consultantId);

            Users user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
            String role = user.getRole().name();


        if (user.getRole() == Role.CONSULTANT) {
                Integer consultantId = user.getConsultant() != null ? user.getConsultant().getId() : null;
                String idErp = user.getConsultant() != null ? user.getConsultant().getIdErp() : null;

//                if (idErp == null) {
//                throw new RuntimeException("Consultant ID ERP is required for login.");
//                }


            return new JwtAuthenticationResponse(jwt, user.getEmail(), consultantId,role, idErp);
            } else if (user.getRole() == Role.ADMIN) {
                return new JwtAuthenticationResponse(jwt, user.getEmail(), null,role, null);

            } else {
                throw new RuntimeException("Unknown role");
            }

    }

    @PostMapping("/admin-vue-globale")
    public String AdminVueGenerale() {
        return "admin-vue-generale";
    }

    @PostMapping("/vue-globale")
    public String VueGenerale() {
        return "vue-generale";
    }

    @PostMapping("/register-consultant")
    public ResponseEntity<?> registerConsultant(@RequestBody UsersRegistrationDTO usersRegistrationDTO) {
        try {
            Users newUser = usersService.registerUser(usersRegistrationDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

}
