import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/UsersProvider.dart';

class LeaveTeamDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final Teams team;

  const LeaveTeamDialog(
      {Key key, @required this.team, @required this.wrappingScaffoldKey})
      : super(key: key);

  @override
  _LeaveTeamDialogState createState() => _LeaveTeamDialogState();
}

class _LeaveTeamDialogState extends State<LeaveTeamDialog> {
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
                      'Bạn có muốn rời nhóm?',
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
                          style: TextStyle(fontSize: 16, color: Colors.black54),
                        )),
                    TextButton(
                        onPressed: () {
                          handleLeaveTeam();
                        },
                        child: Text(
                          'Rời nhóm',
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

  void handleLeaveTeam() async {
    Response res = await TeamService.instance.leaveTeam(widget.team.walletID);

    if (res.statusCode == 200) {
      FocusScope.of(context).unfocus();
      await Provider.of<TeamsProvider>(context, listen: false).fetchData();
      Navigator.pop(context, true);
    } else {
      Map<String, dynamic> body = jsonDecode(res.body);
      Navigator.pop(context, false);
      showSnack(widget.wrappingScaffoldKey, body['msg']);
    }
  }
}
