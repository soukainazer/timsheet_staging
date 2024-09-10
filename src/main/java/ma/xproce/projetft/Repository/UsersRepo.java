package ma.xproce.projetft.Repository;

import ma.xproce.projetft.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsersRepo extends JpaRepository<Users, Integer> {



    Optional<Users> findByEmail(String email);
}
