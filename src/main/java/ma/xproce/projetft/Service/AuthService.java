package ma.xproce.projetft.Service;

import ma.xproce.projetft.Model.Consultant;

public interface AuthService {
    void signup(Consultant consultant);
    boolean login(String email, String password);
}
