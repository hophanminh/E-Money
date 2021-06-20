import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class DeleteEventDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String walletID;
  final String eventID;

  const DeleteEventDialog({Key key, @required this.walletID, @required this.eventID, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _DeleteEventDialogState createState() => _DeleteEventDialogState();
}

class _DeleteEventDialogState extends State<DeleteEventDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          elevation: 0,
          backgroundColor: Colors.white,
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(15, 0, 15, 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 20, bottom: 15),
                      child: Text(
                        'Xác nhận',
                        style:
                        TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 20.0),
                      child: Text(
                        'Sau khi kết thúc sẽ không thể phục hồi trạng thái sự kiện. Bạn có chắc chắn muốn kết thúc sự kiện này?',
                      ),
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: Text(
                            'Hủy',
                            style: TextStyle(fontSize: 16, color: Colors.red),
                          )),
                      TextButton(
                          onPressed: () {
                            handleDeleteEvent();
                          },
                          child: Text(
                            'Kết thúc',
                            style: TextStyle(fontSize: 16, color: Colors.red),
                          )),
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
    );
  }

  void handleDeleteEvent() async {

    Socket socket = await getSocket();
    socket.emitWithAck('end_event', {'walletID': widget.walletID, 'id': widget.eventID}, ack: () {
      showSnack(widget.wrappingScaffoldKey, "Kết thúc sự kiện thành công");
      Navigator.pop(context);
    });

  }
}
