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
  @override
  _NotificationsPageState createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  // ScrollController _scrollController; // = new ScrollController();
  bool _isLoading = false;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  void _loadMoreNotification() async {
    print('load more notification');
    Socket socket = await getSocket();

    NotificationProvider notificationProvider = Provider.of<NotificationProvider>(context, listen: false);
    UsersProvider usersProvider = Provider.of<UsersProvider>(context, listen: false);
    int amountToLoad = notificationProvider.currentLoad + Properties.AMOUNT_TO_LOAD_PER_TIME;
    // print(amountToLoad);
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

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      child: Scaffold(
        appBar: mySimpleAppBar('Thông báo'),
        body: SingleChildScrollView(
          child: Container(
            padding: EdgeInsets.only(top: 20, bottom: 50),
            child: Consumer<NotificationProvider>(
              builder: (context, notificationProvider, child) {
                return Container(
                  width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).size.height,
                  constraints: BoxConstraints(
                    minHeight: 250,
                  ),
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(bottom: 10, left: 10),
                        child: Align(alignment: Alignment.centerLeft, child: Text('Thông báo chưa đọc', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25))),
                      ),
                      Flexible(
                        // height: MediaQuery.of(context).size.height,
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 100.0),
                          child: NotificationListener<ScrollNotification>(
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
                                // controller: _scrollController,
                                physics: AlwaysScrollableScrollPhysics(),
                                shrinkWrap: true,
                                itemCount: notificationProvider.unreadNotifications.length,
                                itemBuilder: (context, index) {
                                  Notifications noti = notificationProvider.unreadNotifications[index];

                                  return Container(
                                      padding: EdgeInsets.all(15),
                                      decoration: BoxDecoration(
                                        color: noti.isRead == 0 ? primary.withOpacity(0.1) : Colors.white,
                                        // border: Border.all(color: primary)
                                      ),
                                      child: Row(
                                        children: [
                                          Expanded(
                                            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                              Text('$index'),
                                              Text(
                                                noti.content,
                                                style: TextStyle(fontSize: 16),
                                              ),
                                              Padding(
                                                padding: const EdgeInsets.only(top: 10.0),
                                                child: Text(
                                                  '${convertToDDMMYYYYHHMM(noti.notifiedAt)}',
                                                  style: TextStyle(color: Colors.black54),
                                                ),
                                              )
                                            ]),
                                          ),
                                          Padding(
                                            padding: const EdgeInsets.only(left: 10.0),
                                            child: TextButton(
                                                onPressed: () {
                                                  handleMarkNotificationAsRead(noti);
                                                },
                                                child: Text(
                                                  'Đánh dấu đã đọc',
                                                  style: TextStyle(fontWeight: FontWeight.bold),
                                                )),
                                          )
                                        ],
                                      ));
                                }),
                          ),
                        ),
                      ),
                      notificationProvider.readNotifications.length == 0
                          ? Container()
                          : Padding(
                              padding: const EdgeInsets.only(top: 5.0, bottom: 10, left: 10),
                              child: Align(alignment: Alignment.centerLeft, child: Text('Thông báo đã đọc', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25))),
                            ),
                      ListView.builder(
                          scrollDirection: Axis.vertical,
                          physics: NeverScrollableScrollPhysics(),
                          shrinkWrap: true,
                          itemCount: notificationProvider.readNotifications.length,
                          itemBuilder: (context, index) {
                            Notifications noti = notificationProvider.readNotifications[index];
                            return Container(
                                padding: EdgeInsets.all(15),
                                decoration: BoxDecoration(
                                  color: noti.isRead == 0 ? primary.withOpacity(0.1) : Colors.white,
                                  // border: Border.all(color: primary)
                                ),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                        Text(
                                          noti.content,
                                          style: TextStyle(fontSize: 16),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.only(top: 10.0),
                                          child: Text(
                                            '${convertToDDMMYYYYHHMM(noti.notifiedAt)}',
                                            style: TextStyle(color: Colors.black54),
                                          ),
                                        )
                                      ]),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.only(left: 10.0),
                                      child: Text(
                                        'Đã đọc',
                                        style: TextStyle(fontWeight: FontWeight.bold),
                                      ),
                                    )
                                  ],
                                ));
                          }),
                      // _isLoading
                      //     ? Padding(
                      //         padding: EdgeInsets.all(15),
                      //         child: Center(child: new SizedBox(width: 40.0, height: 40.0, child: new CircularProgressIndicator())),
                      //       )
                      //     : Container(),
                    ],
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  void handleMarkNotificationAsRead(Notifications notification) async {
    Socket socket = await getSocket();

    // socket.emitWithAck('event', data)
  }
}
