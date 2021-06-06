import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/UsersProvider.dart';

class RemoveMemberDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String userId;

  const RemoveMemberDialog(
      {Key key, @required this.userId, @required this.wrappingScaffoldKey})
      : super(key: key);

  @override
  _RemoveMemberDialogState createState() => _RemoveMemberDialogState();
}

class _RemoveMemberDialogState extends State<RemoveMemberDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(15, 0, 15, 5),
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
                      'Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm ?',
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
                          handleRemoveMember();
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

  void handleRemoveMember() async {
    TeamsProvider teamsProvider = Provider.of<TeamsProvider>(context, listen: false);
    Response res = await TeamService.instance.removeMember(teamsProvider.selected.id, widget.userId);

    if (res.statusCode == 200) {
      FocusScope.of(context).unfocus();
      Navigator.pop(context, true);
      showSnack(widget.wrappingScaffoldKey, "Xóa thành công");
    } else {
      Map<String, dynamic> body = jsonDecode(res.body);
      Navigator.pop(context, false);
      showSnack(widget.wrappingScaffoldKey, body['msg']);
    }
  }
}
