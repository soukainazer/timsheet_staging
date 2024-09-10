package ma.xproce.projetft.Model.dto;


import lombok.Data;

import java.util.List;

@Data
public class FeuilleDeTempsDTO {

    private int id;
    private String period;
    private String statut;
    private double totalJoursT;
    private int year;
    private int month;
    private int consultantId;
    private String idErp;
    private List<WorkedDays> jourtravaille;


    private String pieceJointe;




}
