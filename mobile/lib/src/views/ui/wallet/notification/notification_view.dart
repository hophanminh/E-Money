import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/models/NotificationProvider.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/models/WalletsProvider.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart';

class NotificationsPage extends StatefulWidget {
  final Drawer sidebar;
  final Function setMainRoute;

  const NotificationsPage({this.sidebar, this.setMainRoute});

  @override
  _NotificationsPageState createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  bool _isLoading = false;
  var _scaffoldKey2 = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  void _loadMoreNotification() async {
    Socket socket = await getSocket();
    NotificationProvider notificationProvider = Provider.of<NotificationProvider>(context, listen: false);
    UsersProvider usersProvider = Provider.of<UsersProvider>(context, listen: false);
    int amountToLoad = notificationProvider.currentLoad + Properties.AMOUNT_TO_LOAD_PER_TIME;

    socket.emitWithAck('load_more_notifications', {'userID': usersProvider.info.id, 'limit': amountToLoad}, ack: (data) {
      notificationProvider.addNotifications(data);
      notificationProvider.setCurrentLoad(amountToLoad);

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }

  void handleMarkNotificationAsRead(Notifications notification) async {
    Socket socket = await getSocket();
    UsersProvider usersProvider = Provider.of<UsersProvider>(context, listen: false);
    NotificationProvider notificationProvider = Provider.of<NotificationProvider>(context, listen: false);

    socket.emitWithAck('update_notification', {'userID': usersProvider.info.id, 'limit': notificationProvider.currentLoad, 'notificationID': notification.id, 'value': true},
        ack: (data) {
      notificationProvider.addNotifications(data);
      notificationProvider.setUnreadCount(notificationProvider.count - 1);

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }

  void handleMarkAllAsRead(List<Notifications> unreadNotifications) async {
    Socket socket = await getSocket();
    UsersProvider usersProvider = Provider.of<UsersProvider>(context, listen: false);
    NotificationProvider notificationProvider = Provider.of<NotificationProvider>(context, listen: false);

    socket.emitWithAck('mark_all_as_read', {
      'userID': usersProvider.info.id,
      'notificationIDs': unreadNotifications.map((notification) => notification.id).toList(),
      'limit': notificationProvider.currentLoad
    }, ack: (data) {
      notificationProvider.fetchData(data);
    });
  }

  void viewTransaction(String id) {
    Map<String, dynamic> split =  splitNotificationID(id);
    print(split);
    if (split == null) {
      return;
    }
    if (split['isPrivate'] == true) {
      widget.setMainRoute('privateWallet');
    } else {
      widget.setMainRoute('teamList');
    }
    Provider.of<NotificationProvider>(context, listen: false).setSelected(split);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      child: Scaffold(
          key: _scaffoldKey2,
          appBar: _privateWalletAppBar(),
          drawer: widget.sidebar,
          body: Consumer<NotificationProvider>(
            builder: (context, notificationProvider, child) {
              return NotificationListener<ScrollNotification>(
                onNotification: (ScrollNotification scrollInfo) {
                  if (scrollInfo.metrics.pixels == scrollInfo.metrics.maxScrollExtent) {
                    setState(() {
                      _isLoading = true;
                    });
                    _loadMoreNotification();
                    return true;
                  }

                  return false;
                },
                child: ListView.builder(
                    physics: AlwaysScrollableScrollPhysics(),
                    itemCount: notificationProvider.unreadNotifications.length + 1,
                    itemBuilder: (context, index) {
                      if (notificationProvider.unreadNotifications.length == 0) {
                        return Text('Chưa có thông báo mới');
                      }

                      if (index == 0) {
                        return TextButton(
                          onPressed: () {
                            handleMarkAllAsRead(notificationProvider.unreadNotifications);
                          },
                          child: Text('Đánh dấu tất cả đã đọc'),
                        );
                      }

                      Notifications noti = notificationProvider.unreadNotifications[index - 1];

                      return GestureDetector(
                          onTap: () {
                            viewTransaction(noti.id);
                          },
                          child: Container(
                              padding: EdgeInsets.all(15),
                              margin: EdgeInsets.symmetric(
                                  horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                  color: noti.isRead == 0
                                      ? primary.withOpacity(0.1)
                                      : Colors.white,
                                  borderRadius:
                                  BorderRadius.all(Radius.circular(10))),
                              child: Row(
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(right: 15.0),
                                    child: noti.isRead == 0
                                        ? Icon(Icons.brightness_1,
                                        size: 14.0,
                                        color: Colors.green[800])
                                        : Icon(Icons.check,
                                        size: 25,
                                        color: Colors.transparent),
                                  ),
                                  Expanded(
                                    child: Column(
                                        crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                        children: [
                                          Padding(
                                            padding: const EdgeInsets.only(
                                                top: 15.0),
                                            child: Text(
                                              noti.content,
                                              style: TextStyle(fontSize: 16),
                                            ),
                                          ),
                                          Padding(
                                            padding: const EdgeInsets.only(
                                                top: 10.0),
                                            child: Text(
                                              '${convertToDDMMYYYYHHMM(noti.notifiedAt)}',
                                              style: TextStyle(
                                                  color: Colors.black54),
                                            ),
                                          )
                                        ]),
                                  ),
                                  noti.isRead == 1
                                      ? Padding(
                                    padding:
                                    const EdgeInsets.only(left: 10.0),
                                    child: Text(
                                      'Đã đọc',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold),
                                    ),
                                  )
                                      : Padding(
                                    padding:
                                    const EdgeInsets.only(left: 10.0),
                                    child: TextButton(
                                        onPressed: () {
                                          handleMarkNotificationAsRead(
                                              noti);
                                        },
                                        child: Text(
                                          'Đánh dấu đã đọc',
                                          style: TextStyle(
                                              fontWeight:
                                              FontWeight.bold),
                                        )),
                                  )
                                ],
                              )));
                    }),
              );
            },
          )
          ),
    );
  }

  AppBar _privateWalletAppBar() => AppBar(
      iconTheme: IconThemeData(color: Colors.white),
      leading: myAppBarIcon(_scaffoldKey2),
      title: Text('Thông báo', style: TextStyle(color: Colors.white)),
      backgroundColor: primary,
      centerTitle: true);
}
