package ma.xproce.projetft.Service;

import ma.xproce.projetft.Model.Admin;

import java.util.List;

public interface AdminService {

    Admin getAdminById(int id);
    void deleteAdmin(int id);
    List<Admin> getAllAdmins();

    Admin createAdmin(Admin admin);

    Admin updateAdmin(int id, Admin admin);
}
