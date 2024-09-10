package ma.xproce.projetft.Service;

import ma.xproce.projetft.Model.Users;
import ma.xproce.projetft.Model.dto.UsersRegistrationDTO;

public interface UsersService {
    public Users registerUser(UsersRegistrationDTO usersRegistrationDTO);
}
