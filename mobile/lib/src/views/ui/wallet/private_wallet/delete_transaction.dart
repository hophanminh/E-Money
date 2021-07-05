
import 'package:flutter/material.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart';

class DeleteTransactionDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String txID;

  const DeleteTransactionDialog({Key key, @required this.txID, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _DeleteTransactionDialogState createState() => _DeleteTransactionDialogState();
}

class _DeleteTransactionDialogState extends State<DeleteTransactionDialog> {
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
            padding: const EdgeInsets.fromLTRB(15, 0, 15, 10),
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
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                    ),
                  ),
                ),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 20.0),
                    child: Text(
                      'Bạn có chắc chắn muốn xóa giao dịch này?',
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
                          style: TextStyle(fontSize: 16, color: Colors.black54),
                        )),
                    TextButton(
                        onPressed: () {
                          handleDeleteTx();
                        },
                        child: Text(
                          'Xóa',
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

  void handleDeleteTx() async {
    Socket socket = await getSocket();

    String walletID = Provider.of<UsersProvider>(context, listen: false).info.walletID;
    socket.emitWithAck('delete_transaction', {'walletID': walletID, 'id': widget.txID}, ack: () {
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, "Xóa giao dịch thành công");
    });
  }
}
