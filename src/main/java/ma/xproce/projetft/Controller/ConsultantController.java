package ma.xproce.projetft.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Model.Notification;
import ma.xproce.projetft.Model.dto.ConsultantDTO;
import ma.xproce.projetft.Service.ConsultantService;
import ma.xproce.projetft.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultant")
@RequiredArgsConstructor
@Slf4j
public class ConsultantController {


    @Autowired
    private ConsultantService consultantService;

    @Autowired
    private NotificationService notificationService;


    @GetMapping("/{consultantId}")
    public ResponseEntity<ConsultantDTO> getConsultantById(@PathVariable int consultantId) {
        ConsultantDTO consultant = consultantService.getConsultantById(consultantId);
        return ResponseEntity.ok(consultant);
    }

    @GetMapping
    public ResponseEntity<List<ConsultantDTO>> getAllConsultants() {
        List<ConsultantDTO> consultants = consultantService.getAllConsultants();
        return ResponseEntity.ok(consultants);
    }

    @PutMapping("/{consultantId}")
    public ResponseEntity<Consultant> updateConsultant(@PathVariable int consultantId, @RequestBody Consultant consultant) {
        Consultant updatedConsultant = consultantService.updateConsultant(consultantId, consultant);
        return ResponseEntity.ok(updatedConsultant);
    }

    @PutMapping("/{consultantId}/idErp")
    public ResponseEntity<Consultant> updateIdErpConsultant(@PathVariable int consultantId , @RequestBody String idErp) {
        Consultant updateConsultant = consultantService.updateIdErp(consultantId,idErp);
        return ResponseEntity.ok(updateConsultant);
    }

    @GetMapping("/{counsultantId}/notification")
    public ResponseEntity<List<Notification>> getConsultantNotifications(@PathVariable int consultantId) {
        List<Notification> notification = notificationService.getNotifications(consultantId);
        return ResponseEntity.ok(notification);
    }

}
