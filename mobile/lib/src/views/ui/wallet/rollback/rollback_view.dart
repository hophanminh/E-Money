import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/models/WalletsProvider.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/wallet/rollback/rollback_view_detail.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart';

class TxChangedDiaryDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String walletID;

  const TxChangedDiaryDialog({Key key, @required String this.walletID, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _TxChangedDiaryDialogState createState() => _TxChangedDiaryDialogState();
}

class _TxChangedDiaryDialogState extends State<TxChangedDiaryDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  bool _isLoading = true;
  List<dynamic> _versionList = [];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _initPage();
  }

  void _initPage() async {
    WalletsProvider walletsProvider = Provider.of<WalletsProvider>(context, listen: false);
    Transactions _selected = walletsProvider.selected;
    Socket socket = await getSocket();
    socket.emitWithAck('get_history_transaction', {'walletID': widget.walletID, 'transactionID': _selected.id}, ack: (data) {
      if (mounted) {
        setState(() {
          _versionList = data['historyList'];
          _isLoading = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: _isLoading
          ? Center(
              child: Container(
                child: CircularProgressIndicator(),
              ),
            )
          : Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              elevation: 0,
              backgroundColor: Colors.white,
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(10, 0, 10, 5),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Padding(
                          padding: const EdgeInsets.only(right: 10, left: 10, top: 25, bottom: 15),
                          child: Text(
                            'Lịch sử thay đổi',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                          ),
                        ),
                      ),
                      // Divider(
                      //   thickness: 1,
                      // ),
                      ..._versionList
                          .asMap()
                          .map((i, e) => MapEntry(
                              i,
                              Container(
                                decoration: BoxDecoration(color: i % 2 == 1 ? Colors.transparent : Colors.black12),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Row(
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.only(right: 25.0, left: 20),
                                          child: Text(
                                            '${_versionList.length - i}',
                                            style: TextStyle(fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        Expanded(child: Text(convertToDDMMYYYYHHMM(e['DateModified']))),
                                        Column(
                                          children: [
                                            TextButton(
                                                onPressed: () {
                                                  Navigator.push(
                                                      context,
                                                      MaterialPageRoute(
                                                          builder: (context) => RollbackViewDetail(
                                                                data: e,
                                                                version: _versionList.length - i,
                                                                isCurrent: i == 0,
                                                                handleRestore: handleRestore,
                                                              )));
                                                },
                                                child: Text('Thông tin')),
                                            i == 0
                                                ? Container()
                                                : TextButton(
                                                    onPressed: () {
                                                      handleRestore(e);
                                                      Navigator.pop(context);
                                                    },
                                                    child: Text(
                                                      'Phục hồi',
                                                      style: TextStyle(color: warning),
                                                    ))
                                          ],
                                        ),
                                      ],
                                    ),
                                    // Divider(
                                    //   thickness: 0.9,
                                    // )
                                  ],
                                ),
                              )))
                          .values
                          .toList(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                              },
                              child: Text(
                                'Đóng',
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

  void handleRestore(dynamic version) async {
    WalletsProvider walletsProvider = Provider.of<WalletsProvider>(context, listen: false);
    Transactions _selected = walletsProvider.selected;
    Socket socket = await getSocket();
    socket.emit('restore_transaction', {'walletID': widget.walletID, 'transactionID': _selected.id, 'newTransaction': version});
    // showSnack(widget.wrappingScaffoldKey, "Xóa giao dịch thành công");
    // Navigator.pop(context);
  }
}
