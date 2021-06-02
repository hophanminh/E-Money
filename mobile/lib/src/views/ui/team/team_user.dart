import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile/src/config/config.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';

class TeamUser extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final Teams team;

  const TeamUser(
      {Key key, @required this.team, @required this.wrappingScaffoldKey})
      : super(key: key);

  @override
  _TeamUserState createState() => _TeamUserState();
}

class _TeamUserState extends State<TeamUser> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  List<dynamic> _userList = [];

  void _fetchData() async {
    Response res = await TeamService.instance.getTeamUsers(widget.team.id);
    if (res == null || res.statusCode != 200) {
      throw Exception("Không lấy được dữ liệu từ server");
    }
    Map<String, dynamic> body = jsonDecode(res.body);

    if (!mounted) {
      return;
    }
    if (body['users'] != null && body['users'].length > 0) {
      setState(() {
        _userList = body['users'];
      });
    }
  }

  @override
  void initState() {
    _fetchData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusManager.instance.primaryFocus.unfocus();
      },
      child: ScaffoldMessenger(
        key: _scaffoldKey,
        child: Scaffold(
          appBar: mySimpleAppBar('Thành viên nhóm'),
          // backgroundColor: Colors.transparent,
          body: RefreshIndicator(
            onRefresh: () => Future.delayed(Duration(milliseconds: 500), () {
              FocusScope.of(context).unfocus();
              _fetchData();
            }),
            child: createListView(),
          ),
        ),
      ),
    );
  }

  Widget createListView() {
    return ListView.builder(
      padding: EdgeInsets.all(16.0),
      itemCount: _userList.length,
      scrollDirection: Axis.vertical,
      itemBuilder: (BuildContext context, int index) {
        return buildRow(_userList[index]["Name"], _userList[index]["Role"]);
      },
    );
  }

  Widget buildRow(String name, int role) {
    return Column(children: [
      ListTile(
        title: Text(
          name,
          style: TextStyle(fontSize: 18.0),
        ),
        trailing: role == Properties.ROLE_ADMIN ? Icon(Icons.flag, color: Colors.red,) : null,
      ),
      Divider(thickness: 1,)
    ]);
  }
}
