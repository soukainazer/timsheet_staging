package ma.xproce.projetft.Model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkedDays {

    private List<WorkedDayDto> workedDays;


    @Setter
    @Getter
    @Data
    public static class WorkedDayDto {
        private String date;
        private Integer bonDeCommandeId;
        private double duration;
    }

}
