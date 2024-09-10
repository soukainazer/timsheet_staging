package ma.xproce.projetft.Controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.xproce.projetft.Model.FeuilleDeTemps;
import ma.xproce.projetft.Model.Notification;
import ma.xproce.projetft.Model.dto.FeuilleDeTempsDTO;
import ma.xproce.projetft.Model.dto.WorkedDays;
import ma.xproce.projetft.Service.FeuilleDeTempsService;
import ma.xproce.projetft.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/feuilledetemps")
@RequiredArgsConstructor
@Slf4j
public class FeuilleDeTempsController {
    @Autowired
    private   FeuilleDeTempsService feuilleDeTempsService;

    @Autowired
    private NotificationService notificationService;





    @GetMapping("{consultantId}/{year}/{month}")
    public ResponseEntity<List<FeuilleDeTempsDTO>> getTimeSheet(
            @PathVariable int consultantId,
            @PathVariable int year,
            @PathVariable int month) {

        List<FeuilleDeTemps> feuilleDeTempsList = feuilleDeTempsService.getTimesheetsByConsultantAndPeriod(consultantId, year, month);

        List<FeuilleDeTempsDTO> feuilleDeTempsDTOList = feuilleDeTempsList.stream()
                .map(feuilleDeTempsService::convertToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(feuilleDeTempsDTOList, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addBulk(@RequestParam int consultantId,
                                        @RequestParam int year,
                                        @RequestParam int month,
                                        @RequestParam String workedDaysJson,
                                        @RequestParam Map<String, MultipartFile> files) {

        System.out.println("Consultant ID: " + consultantId);
        System.out.println("Year: " + year);
        System.out.println("Month: " + month);


        List<WorkedDays.WorkedDayDto> workedDays = parseWorkedDays(workedDaysJson);
        Map<Integer, MultipartFile> fileMap = new HashMap<>();

        for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
            String fileName = entry.getKey();
            MultipartFile file = entry.getValue();
            String[] parts = fileName.split("_");
            if (parts.length > 1) {
                try {
                    Integer bcId = Integer.parseInt(parts[1]);
                    fileMap.put(bcId, file);
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().build();
                }
            }
        }
        if (fileMap.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }


            feuilleDeTempsService.bulkAddFeuilleDeTempsDays(consultantId, year, month, workedDays, fileMap);
            return ResponseEntity.ok().build();


    }




    private List<WorkedDays.WorkedDayDto> parseWorkedDays(String workedDaysJson) {

        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(workedDaysJson, new TypeReference<List<WorkedDays.WorkedDayDto>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }}



    @GetMapping("/timesheets")
    public List<FeuilleDeTempsDTO> getAllTimesheets() {
        return feuilleDeTempsService.getAllFeuilleDeTemps();
    }

    @GetMapping("/admin/timesheet/{id}")
    public ResponseEntity<FeuilleDeTempsDTO> getTimesheetById(@PathVariable("id") int id) {
        FeuilleDeTempsDTO feuilleDeTempsDTO = feuilleDeTempsService.getFeuilleDeTempsDTOById(id);
        if (feuilleDeTempsDTO != null) {
            return ResponseEntity.ok(feuilleDeTempsDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }




//    @PutMapping("/update")
//    public ResponseEntity<FeuilleDeTemps> updateFeuilleDeTemps(
//            @PathVariable int consultantId,
//            @PathVariable int year,
//            @PathVariable int month,
//            @RequestBody FeuilleDeTempsDTO feuilleDeTempsDTO) {
//        FeuilleDeTemps updatedFeuilleDeTemps = feuilleDeTempsService.updateFeuilleDeTemps(consultantId,year,month, feuilleDeTempsDTO);
//        return ResponseEntity.ok(updatedFeuilleDeTemps);
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeuilleDeTemps(@PathVariable int id) {
        feuilleDeTempsService.deleteFeuilleDeTemps(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<?> validerFeuilleDeTemps(@PathVariable int id) {
        try {
            FeuilleDeTemps feuilleDeTemps = feuilleDeTempsService.validerFeuilleDeTemps(id);
            if (feuilleDeTemps == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Timesheet not found.");
            }
            return ResponseEntity.ok(feuilleDeTemps);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error validating timesheet.");
        }
    }

    @PutMapping("/{id}/rejeter")
    public ResponseEntity<Void> rejectTimesheet(@PathVariable int id, @RequestBody Map<String, String> requestBody) {
        String reason = requestBody.get("message");
        try {
            feuilleDeTempsService.rejeterFeuilleDeTemps(id, reason);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/notification/{timesheetId}")
    public ResponseEntity<List<Notification>>  getNotificationByTimesheetId(@PathVariable int timesheetId) {
        List<Notification> notification = notificationService.getNotifications(timesheetId);
        return ResponseEntity.ok(notification);
    }

}






