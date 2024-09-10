package ma.xproce.projetft.Service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.xproce.projetft.Model.Consultant;
import ma.xproce.projetft.Model.FeuilleDeTemps;
import ma.xproce.projetft.Model.JourTravaille;
import ma.xproce.projetft.Model.Notification;
import ma.xproce.projetft.Model.dto.FeuilleDeTempsDTO;
import ma.xproce.projetft.Model.dto.WorkedDays;
import ma.xproce.projetft.Repository.ConsultantRepo;
import ma.xproce.projetft.Repository.FeuilleDeTempsRepo;
import ma.xproce.projetft.Repository.JourTravailleRepo;
import ma.xproce.projetft.Repository.Notificationrepo;
import ma.xproce.projetft.Service.FeuilleDeTempsService;
import ma.xproce.projetft.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeuilleDeTempsServiceImpl implements FeuilleDeTempsService {

    @Autowired
    private FeuilleDeTempsRepo feuilleDeTempsRepo;

    @Autowired
    private Notificationrepo notificationrepo;

    @Autowired
    private JourTravailleRepo jourTravailleRepo;
    @Autowired
    private ConsultantRepo consultantRepo;

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<FeuilleDeTemps> getTimesheetsByConsultantAndPeriod(int consultantId, int year, int month) {
        List<FeuilleDeTemps> timesheets = feuilleDeTempsRepo.findByConsultantIdAndYearAndMonth(consultantId, year, month);
        if (timesheets.isEmpty()) {

            System.out.println("No timesheets found for consultantId: " + consultantId + ", year: " + year + ", month: " + month);
        }
        return timesheets;
    }
//    @Override
//    public  FeuilleDeTemps getOrCreateFeuilleDeTempsForMonth(int consultantId, int year, int month){
//
//        Consultant consultant = consultantRepo.findById(consultantId).orElseThrow(()-> new RuntimeException("Consultant not found"));
//        return  feuilleDeTempsRepo.findByConsultantIdAndYearAndMonth(consultantId,year,month).orElseGet(
//                ()-> {
//                    FeuilleDeTemps newFeuilleDeTemps = new FeuilleDeTemps();
//                    newFeuilleDeTemps.setConsultant(consultant);
//                    newFeuilleDeTemps.setMonth(month);
//                    newFeuilleDeTemps.setYear(year);
//                    newFeuilleDeTemps.setTotalJoursT(0);
//
////                    newFeuilleDeTemps.setWorkedDays(new ArrayList<>());
//                    return feuilleDeTempsRepo.save(newFeuilleDeTemps);
//
//                }
//        );
//    }

    @Override
    public  FeuilleDeTemps getOrCreateFeuilleDeTempsForMonthAndBC(int consultantId, int year, int month, int bcId){

        Consultant consultant = consultantRepo.findById(consultantId).orElseThrow(()-> new RuntimeException("Consultant not found"));
        return  feuilleDeTempsRepo.findByConsultantIdAndYearAndMonthAndBcId(consultantId,year,month, bcId).orElseGet(
                ()-> {
                    FeuilleDeTemps newFeuilleDeTemps = new FeuilleDeTemps();
                    newFeuilleDeTemps.setConsultant(consultant);
                    newFeuilleDeTemps.setMonth(month);
                    newFeuilleDeTemps.setYear(year);
                    newFeuilleDeTemps.setBcId(bcId);
                    newFeuilleDeTemps.setTotalJoursT(0);

//                    newFeuilleDeTemps.setWorkedDays(new ArrayList<>());
                    return feuilleDeTempsRepo.save(newFeuilleDeTemps);

                }
        );
    }

//    @Override
//    public JourTravaille addTimeSheetDay(int consultantId, LocalDate date){
//
//        int year = date.getYear();
//        int month = date.getMonthValue();
//        Consultant consultant = consultantRepo.findById(consultantId).orElseThrow(()-> new RuntimeException("Consultant not found"));
//
//
//        FeuilleDeTemps feuilleDeTemps= getOrCreateFeuilleDeTempsForMonth(consultantId,year,month);
//
//        JourTravaille feuilleDeTempsDay = new JourTravaille();
//        feuilleDeTempsDay.setConsultant(consultant);
//        feuilleDeTempsDay.setDate(date);
//        feuilleDeTempsDay.setHoursWorked(true);
//        feuilleDeTempsDay.setFeuilleDeTemps(feuilleDeTemps);
//
//        jourTravailleRepo.save(feuilleDeTempsDay);
//        return feuilleDeTempsDay;
//
//    }

    @Override
    public void bulkAddFeuilleDeTempsDays(int consultantId,
                                          int year, int month,
                                          List<WorkedDays.WorkedDayDto> workedDays,
                                          Map<Integer, MultipartFile> pieceJointe){

        Consultant consultant = consultantRepo.findById(consultantId).orElseThrow(()-> new RuntimeException("Consultant not found"));

        Map<Integer, List<WorkedDays.WorkedDayDto>> workedDaysByBC = workedDays.stream()
                .collect(Collectors.groupingBy(WorkedDays.WorkedDayDto::getBonDeCommandeId));

        for (Map.Entry<Integer, List<WorkedDays.WorkedDayDto>> entry : workedDaysByBC.entrySet()) {
            Integer bcId = entry.getKey();
            List<WorkedDays.WorkedDayDto> daysForBC = entry.getValue();

            if (daysForBC == null || daysForBC.isEmpty()) {
                throw new RuntimeException("Worked days cannot be null or empty.");
            }

        FeuilleDeTemps feuilleDeTemps =getOrCreateFeuilleDeTempsForMonthAndBC(consultantId,year,month,bcId);


            MultipartFile file = pieceJointe.get(bcId);

            if (file != null && !file.isEmpty()) {
                try {
                    byte[] decodedBytes = file.getBytes();
                    feuilleDeTemps.setPieceJointe(decodedBytes);

                    String fileName = "output-" + bcId + ".pdf";
                    try (OutputStream os = new FileOutputStream(fileName)) {
                        os.write(decodedBytes);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } catch ( IOException e) {
                    e.printStackTrace();
                }
            }

        List<JourTravaille> existingJourTravaille = jourTravailleRepo.findByFeuilleDeTemps(feuilleDeTemps);
        jourTravailleRepo.deleteAll(existingJourTravaille);

        List<JourTravaille> jourTravailles = daysForBC.stream().map(workedDayDto-> {
            JourTravaille day = new JourTravaille();
            day.setConsultant(consultant);
            day.setDate(LocalDate.parse(workedDayDto.getDate()));
            day.setHoursWorked(true);

            day.setBonDeCommandeId(bcId);
            day.setDuration(workedDayDto.getDuration());
            day.setFeuilleDeTemps(feuilleDeTemps);
            return day;
        }).collect(Collectors.toList());

        if (!jourTravailles.isEmpty()) {
            jourTravailleRepo.saveAll(jourTravailles);

            double totalDuration = jourTravailles.stream()
                    .mapToDouble(JourTravaille::getDuration)
                    .sum();

            feuilleDeTemps.setTotalJoursT(totalDuration);
            feuilleDeTemps.setStatut("pending");


            feuilleDeTempsRepo.save(feuilleDeTemps);
        }

    }
    }








    @Override
    public List<FeuilleDeTempsDTO> getAllFeuilleDeTemps() {
        return feuilleDeTempsRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FeuilleDeTempsDTO getFeuilleDeTempsDTOById(int id) {
        FeuilleDeTemps feuilleDeTemps = feuilleDeTempsRepo.findById(id).orElse(null);
        return convertToDTO(feuilleDeTemps);
    }

//    @Override
//    public FeuilleDeTempsDTO getFeuilleDeTemps(int id,Integer year,Integer month) {
//        FeuilleDeTemps feuilleDeTemps = feuilleDeTempsRepo.findByConsultantIdAndYearAndMonth(id,year,month).orElse(null);
//        return convertToDTO(feuilleDeTemps);
//    }


    @Override
    public void deleteFeuilleDeTemps(int id) {
        feuilleDeTempsRepo.deleteById(id);
    }

    @Override
    public FeuilleDeTemps validerFeuilleDeTemps(int id) {
        FeuilleDeTemps feuilleDeTemps = feuilleDeTempsRepo.findById(id).orElseThrow();
         feuilleDeTemps.setStatut("valider");
        return feuilleDeTempsRepo.save(feuilleDeTemps);
    }



    @Override
    public void rejeterFeuilleDeTemps(int timesheetId, String reason) {

        FeuilleDeTemps timesheet = feuilleDeTempsRepo.findById(timesheetId)
                .orElseThrow(() -> new RuntimeException("Timesheet not found with id:"+ timesheetId));
        timesheet.setStatut("rejeter");
        timesheet.setRejectionReason(reason);
        feuilleDeTempsRepo.save(timesheet);

        Notification notification = new Notification();
        notification.setConsultantId(timesheet.getConsultant().getId());
        notification.setMessage("La feuille de temps Invalid: " + reason);
        notification.setTimesheetId(timesheetId);

        notificationrepo.save(notification);
    }

    @Override
    public FeuilleDeTempsDTO convertToDTO(FeuilleDeTemps feuilleDeTemps) {
        FeuilleDeTempsDTO dto = new FeuilleDeTempsDTO();
        dto.setId(feuilleDeTemps.getId());
        dto.setStatut(feuilleDeTemps.getStatut());
        dto.setTotalJoursT(feuilleDeTemps.getTotalJoursT());
        dto.setYear(feuilleDeTemps.getYear());
        dto.setMonth(feuilleDeTemps.getMonth());
        dto.setConsultantId(feuilleDeTemps.getConsultant().getId());

        if (feuilleDeTemps.getPieceJointe() != null) {
            String encodedPieceJointe = Base64.getEncoder().encodeToString(feuilleDeTemps.getPieceJointe());
            dto.setPieceJointe(encodedPieceJointe);
        }

        WorkedDays workedDays = new WorkedDays();

        List<WorkedDays.WorkedDayDto> workedDaysList = feuilleDeTemps.getJourTravaille() != null ?
                feuilleDeTemps.getJourTravaille().stream()
                .map(jourTravaille -> {
                    WorkedDays.WorkedDayDto dayDto = new WorkedDays.WorkedDayDto();
                    dayDto.setDate(jourTravaille.getDate().toString()); // Convert LocalDate to String
                    dayDto.setBonDeCommandeId(jourTravaille.getBonDeCommandeId()); // Directly use bonDeCommandeId
                    dayDto.setDuration(jourTravaille.getDuration());
                    return dayDto;
                })
                .collect(Collectors.toList()):new ArrayList<>();

        workedDays.setWorkedDays(workedDaysList);

        dto.setJourtravaille(List.of(workedDays));



        return dto;
    }



}
