import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class DeleteTeamDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final Teams team;

  const DeleteTeamDialog(
      {Key key, @required this.team, @required this.wrappingScaffoldKey})
      : super(key: key);

  @override
  _DeleteTeamDialogState createState() => _DeleteTeamDialogState();
}

class _DeleteTeamDialogState extends State<DeleteTeamDialog> {
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
                      'Bạn có chắc muốn xóa nhóm?',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
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
                          style: TextStyle(fontSize: 16),
                        )),
                    TextButton(
                        onPressed: () {
                          handleDeleteTeam();
                          Navigator.of(context).pop();
                        },
                        child: Text(
                          'Xóa',
                          style: TextStyle(fontSize: 16),
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

  void handleDeleteTeam() async {
    // Response res = await TeamService.instance.deleteTeam(id);
    //
    // if (res.statusCode == 201) {
    //   FocusScope.of(context).unfocus();
    //   await Future.delayed(const Duration(seconds: 1), () {});
    //   Navigator.pop(context, true); // trở về private wallet
    //   showSnack(widget.wrappingScaffoldKey, "Tham gia thành công");
    //   //_infoInit = info;
    // } else {
    //   Map<String, dynamic> body = jsonDecode(res.body);
    //   setState(() {
    //     customError = body['msg'];
    //   });
    //   _formKey.currentState.validate();
    //   await Future.delayed(const Duration(seconds: 1), () {});
    // }
  }
}
