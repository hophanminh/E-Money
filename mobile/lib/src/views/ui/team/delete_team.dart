import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/UsersProvider.dart';

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
                      'Bạn có muốn xóa nhóm?',
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
                        },
                        child: Text(
                          'Xóa nhóm',
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
    Response res = await TeamService.instance.deleteTeam(widget.team.walletID);

    if (res.statusCode == 200) {
      FocusScope.of(context).unfocus();
      Provider.of<TeamsProvider>(context, listen: false).fetchData();
      Navigator.pop(context, true);
    } else {
      Map<String, dynamic> body = jsonDecode(res.body);
      await Future.delayed(const Duration(seconds: 1), () {});
      showSnack(widget.wrappingScaffoldKey, body['msg']);
    }
  }
}
