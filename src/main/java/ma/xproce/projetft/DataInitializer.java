package ma.xproce.projetft;

import ma.xproce.projetft.Model.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import ma.xproce.projetft.Model.Users;
import ma.xproce.projetft.Repository.UsersRepo;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner loadData(UsersRepo usersRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user already exists
            if (usersRepo.findByEmail("admin@example.com").isEmpty()) {
                Users admin = new Users();
                admin.setEmail("admin@example.com");
                admin.setMotDePasse(passwordEncoder.encode("adminPassword")); // Encode the password
                admin.setRole(Role.valueOf("ADMIN"));
                usersRepo.save(admin);
            }
        };
    }
}