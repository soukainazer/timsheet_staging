package ma.xproce.projetft.Service;

import ma.xproce.projetft.Model.Notification;
import org.springframework.stereotype.Service;

import java.util.List;


public interface NotificationService {
    List<Notification> getNotifications(int id);

    void addNotification(int id, Notification notification);

    void clearNotifications(int id);
}
