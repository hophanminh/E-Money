import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class DeleteCateDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String walletID;
  final String cateID;

  const DeleteCateDialog({Key key, @required this.walletID, @required this.cateID, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _DeleteCateDialogState createState() => _DeleteCateDialogState();
}

class _DeleteCateDialogState extends State<DeleteCateDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    setState(() {

    });
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Dialog(
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
                    alignment: Alignment.centerRight,
                    child: IconButton(
                      icon: Icon(Icons.close),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 15.0),
                    child: Text(
                      'Xác nhận',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 20.0),
                    child: Text(
                      'Những giao dịch của loại này sẽ tự động đổi sang loại mặc định "Khác". Bạn có chắc chắn muốn xóa loại này?',
                      textAlign: TextAlign.center,
                    ),
                  ),
                  myAlignedButton('Xóa', backgroundColor: warning, action: () {
                    handleDeleteCate();
                  })
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void handleDeleteCate() async {
    print('delete cate');

    Socket socket = await getSocket();
    socket.emitWithAck("delete_category", {'walletID': widget.walletID, 'id': widget.cateID}, ack: () {
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, 'Đã xóa');
    });
  }
}
