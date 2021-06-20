import 'package:flutter/cupertino.dart';
import 'package:mobile/src/config/config.dart';

class NotificationProvider extends ChangeNotifier {
  List<Notifications> _notifications = [];
  // List<Notifications> _readNotifications = [];
  int _unreadCount = 0;
  int currentLoad = Properties.AMOUNT_TO_LOAD_PER_TIME;

  setList(List<Notifications> notifications) {
    this._notifications = notifications;//.where((element) => element.isRead == 0).toList();
    // this._readNotifications = notifications.where((element) => element.isRead == 1).toList();

    notifyListeners();
  }

  setUnreadCount(int count) {
    this._unreadCount = count;
    notifyListeners();
  }

  setCurrentLoad(int current) {
    this.currentLoad = current;
    notifyListeners();
  }

  Future<bool> fetchData(Map<String, dynamic> body) async {
    try {
      List<Notifications> notifications = [];
      for (dynamic noti in body['notificationList']) {
        notifications.add(Notifications.fromJson(noti));
      }

      this.setList(notifications);
      this.setUnreadCount(body['count']);

      return true;
    } on Exception catch (e) {
      print('parse error');
      return false;
    }
  }

  Future<bool> addNotifications(Map<String, dynamic> body) async {
    try {
      List<Notifications> notifications = [];
      for (dynamic noti in body['notificationList']) {
        notifications.add(Notifications.fromJson(noti));
      }

      this.setList(notifications);

      return true;
    } on Exception catch (e) {
      return false;
    }
  }

  int get count => this._unreadCount;

  List<Notifications> get unreadNotifications => this._notifications;

  // List<Notifications> get readNotifications => this._readNotifications;
}

class Notifications {
  String id;
  int isRead;
  String content;
  String notifiedAt;

  Notifications({this.id, this.isRead, this.content, this.notifiedAt});

  factory Notifications.fromJson(Map<String, dynamic> json) {
    return Notifications(
      id: json['ID'] as String,
      isRead: json['IsRead'] as int,
      content: json['Content'] as String,
      notifiedAt: json['DateNotified'] as String,
    );
  }
}
