import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class DeleteTransactionImageDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String imageID;
  final String txID;
  final void Function(String id) removeImageByID;

  const DeleteTransactionImageDialog({Key key, @required this.imageID, @required this.removeImageByID, @required this.txID, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _DeleteTransactionImageDialogState createState() => _DeleteTransactionImageDialogState();
}

class _DeleteTransactionImageDialogState extends State<DeleteTransactionImageDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
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
                      'Bạn có chắc chắn muốn xóa ảnh giao dịch này?',
                      textAlign: TextAlign.center,
                    ),
                  ),
                  myAlignedButton('Xóa', backgroundColor: warning, action: () {
                    handleDeleteTxImage();
                  })
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void handleDeleteTxImage() async {
    print('delete tx image');
    Socket socket = await getSocket();

    socket.emitWithAck('remove_transaction_image', { 'imageID': widget.imageID, 'transactionID': widget.txID}, ack: (data) {
      if (data == 200) {
        widget.removeImageByID(widget.imageID);
        showSnack(widget.wrappingScaffoldKey, "Xóa giao dịch thành công");
        Navigator.pop(context);
      }
    });
  }
}
