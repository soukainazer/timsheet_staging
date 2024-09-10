package ma.xproce.projetft.Service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.xproce.projetft.Model.Admin;
import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Repository.AdminRepo;
import ma.xproce.projetft.Service.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private AdminRepo adminRepo;

    @Override
    public Admin createAdmin(Admin admin) {
        return adminRepo.save(admin);
    }

    @Override
    public Admin updateAdmin(int adminId, Admin admin) {
        return adminRepo.findById(adminId).map(existingAdmin -> {
            existingAdmin.setEmail(admin.getEmail());



            return adminRepo.save(existingAdmin);
        }).orElseThrow(() -> new RuntimeException("Consultant not found with id: " + adminId));
    }

    @Override
    public Admin getAdminById(int id) {
        return adminRepo.findById(id).get();
    }

    @Override
    public void deleteAdmin(int id) {
        adminRepo.deleteById(id);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepo.findAll();
    }
}
