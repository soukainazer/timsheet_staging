package ma.xproce.projetft.Repository;

import ma.xproce.projetft.Model.JourTravaille;
import ma.xproce.projetft.Model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Notificationrepo extends JpaRepository<Notification, Long>  {
    List<Notification> findByTimesheetId(int timesheetId);
}
