package ma.xproce.projetft.Security;

import ma.xproce.projetft.Model.Users;
import ma.xproce.projetft.Repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepo userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

       // return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getMotDePasse(), new ArrayList<>());
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getMotDePasse())
                .roles(user.getRole().name())
                .build();
    }
}
