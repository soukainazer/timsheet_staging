package ma.xproce.projetft.Service.Impl;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.xproce.projetft.Model.Notification;
import ma.xproce.projetft.Repository.Notificationrepo;
import ma.xproce.projetft.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

@Autowired
private Notificationrepo notificationrepo;

    private Map<Integer, List<Notification>> notifications = new HashMap<>();

    @Override
    public List<Notification> getNotifications(int timesheetId) {
        return notificationrepo.findByTimesheetId(timesheetId);
    }

    @Override
    public void addNotification(int id, Notification notification) {
        notifications.computeIfAbsent(id, k -> new ArrayList<>()).add(notification);
    }

    @Override
    public void clearNotifications(int id){
        notifications.remove(id);
    }

}
