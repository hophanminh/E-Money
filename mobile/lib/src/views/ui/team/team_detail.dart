import 'dart:convert';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/ui/team/edit_team.dart';
import 'package:mobile/src/views/ui/team/team_user.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:provider/provider.dart';

import 'delete_team.dart';
import 'leave_team.dart';

class TeamDetail extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;

  const TeamDetail({Key key, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _TeamDetailState createState() => _TeamDetailState();
}

class _TeamDetailState extends State<TeamDetail> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  bool roles = true;

  @override
  void initState() {
    _initPage();
    super.initState();
  }

  _initPage() async {
    String id = Provider.of<TeamsProvider>(context, listen: false).selected.id;
    Response res = await TeamService.instance.getRoles(id);
    if (res == null || res.statusCode != 200) {
      throw Exception("Không lấy được dữ liệu từ server");
    }
    Map<String, dynamic> body = jsonDecode(res.body);

    if (!mounted) {
      return;
    }
    if (body['info']['Role'] == Properties.ROLE_ADMIN && body['info']['Status'] == Properties.ROLE_ACTIVE) {
      setState(() {
        roles = true;
      });
    } else {
      setState(() {
        roles = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Colors.white,
        appBar: _appBar(),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.only(left: 8, right: 8, top: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                ConstrainedBox(
                  constraints: new BoxConstraints(
                    minHeight: MediaQuery.of(context).size.height - 200,
                  ),
                  child: Consumer<TeamsProvider>(
                    builder: (context, teamsProvider, child) {
                      return teamsProvider.selected != null
                          ? Column(children: [
                              Padding(
                                padding: const EdgeInsets.only(top: 0, left: 16, bottom: 8, right: 16),
                                child: Text(
                                  'Nhóm\n${teamsProvider.selected.name}',
                                  textAlign: TextAlign.center,
                                  maxLines: 2,
                                  style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 22,
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.only(top: 0, left: 16, bottom: 8, right: 16),
                                child: Text(
                                  'Tạo lúc:  ${convertToDDMMYYYY(teamsProvider.selected.createdDate)}',
                                  textAlign: TextAlign.left,
                                  style: TextStyle(
                                    fontWeight: FontWeight.w300,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.only(left: 16, right: 16, bottom: 8, top: 16),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: <Widget>[
                                    createPeopleBox(teamsProvider.selected.currentUsers.toString(), "Hiện tại"),
                                    createCopyCodeBox('Mã nhóm', teamsProvider.selected.id)
                                  ],
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.only(top: 20.0, left: 16, bottom: 8, right: 16),
                                child: Text(
                                  'Mô tả',
                                  textAlign: TextAlign.left,
                                  style: TextStyle(
                                    fontSize: 18,
                                    letterSpacing: 0.27,
                                  ),
                                ),
                              ),
                              Row(mainAxisAlignment: MainAxisAlignment.start, crossAxisAlignment: CrossAxisAlignment.start, children: [
                                Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 16),
                                    child: Container(
                                      child: Text(
                                        teamsProvider.selected.description,
                                        textAlign: TextAlign.justify,
                                        style: TextStyle(
                                          fontSize: 14,
                                        ),
                                      ),
                                    )),
                              ]),
                            ])
                          : Container();
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 16, top: 36, bottom: 16, right: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Expanded(
                        child: GestureDetector(
                          onTap: () async {
                            Teams temp = Provider.of<TeamsProvider>(context, listen: false).selected;
                            if (roles) {
                              var result = await showDialog(
                                  context: context,
                                  builder: (_) => DeleteTeamDialog(
                                        team: temp,
                                        wrappingScaffoldKey: _scaffoldKey,
                                      ));
                              if (result != null && result) {
                                Navigator.pop(context, 'delete');
                              }
                            } else {
                              var result = await showDialog(
                                  context: context,
                                  builder: (_) => LeaveTeamDialog(
                                        team: temp,
                                        wrappingScaffoldKey: _scaffoldKey,
                                      ));
                              if (result != null && result) {
                                Navigator.pop(context, 'leave');
                              }
                            }
                          },
                          child: Container(
                            width: 48,
                            height: 48,
                            child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.red,
                                  borderRadius: const BorderRadius.all(
                                    Radius.circular(16.0),
                                  ),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.only(right: 20),
                                      child: Icon(
                                        roles ? Icons.clear : Icons.clear,
                                        color: Colors.white,
                                        size: 28,
                                      ),
                                    ),
                                    Text(
                                      roles ? "Xóa nhóm" : 'Rời nhóm',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 18,
                                        letterSpacing: 0.0,
                                        color: Colors.white,
                                      ),
                                    )
                                  ],
                                )),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  AppBar _appBar() => AppBar(
      shadowColor: Colors.transparent,
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Thông tin nhóm', style: TextStyle(color: Colors.white)),
      actions: [
        IconButton(
          icon: Icon(Icons.edit, size: 26),
          onPressed: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => EditTeam(
                          team: Provider.of<TeamsProvider>(context, listen: false).selected,
                          wrappingScaffoldKey: _scaffoldKey,
                        )));
          },
        ),
        // PopupMenuButton(
        //   itemBuilder: (BuildContext bc) => [
        //     if (roles)
        //       PopupMenuItem(
        //         value: "/edit",
        //         child: Row(
        //           children: <Widget>[
        //             Padding(
        //                 padding: const EdgeInsets.only(right: 20),
        //                 child: Icon(
        //                   Icons.edit,
        //                   size: 24,
        //                   color: Colors.black,
        //                 )),
        //             Text(" Sửa thông tin"),
        //           ],
        //         ),
        //       ),
        //     PopupMenuItem(
        //       value: "/list",
        //       child: Row(
        //         children: <Widget>[
        //           Padding(
        //               padding: const EdgeInsets.only(right: 20),
        //               child: Icon(
        //                 Icons.people,
        //                 size: 24,
        //                 color: Colors.black,
        //               )),
        //           Text("Xem thành viên"),
        //         ],
        //       ),
        //     ),
        //   ],
        //   onSelected: (route) async {
        //     Teams temp = Provider.of<TeamsProvider>(context, listen: false).selected;
        //     if (route == '/edit') {
        //       Navigator.push(
        //           context,
        //           MaterialPageRoute(
        //               builder: (context) => EditTeam(
        //                     team: temp,
        //                     wrappingScaffoldKey: _scaffoldKey,
        //                   )));
        //     }
        //     if (route == '/list') {
        //       Navigator.push(
        //           context,
        //           MaterialPageRoute(
        //               builder: (context) => TeamUser(
        //                     team: temp,
        //                     wrappingScaffoldKey: _scaffoldKey,
        //                   )));
        //     }
        //   },
        // ),
      ],
      backgroundColor: primary,
      centerTitle: true);

  Widget createPeopleBox(String text1, String txt2) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => TeamUser(
                      team: Provider.of<TeamsProvider>(context, listen: false).selected,
                      wrappingScaffoldKey: _scaffoldKey,
                    )));
      },
      child: Padding(
          padding: const EdgeInsets.only(right: 10),
          child: Container(
            width: 100,
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.2),
              borderRadius: const BorderRadius.all(Radius.circular(16.0)),
            ),
            child: Padding(
              padding: const EdgeInsets.only(left: 18.0, right: 18.0, top: 12.0, bottom: 12.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        text1,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: Colors.blue,
                        ),
                      ),
                      Icon(
                        Icons.emoji_people,
                        color: Colors.blue,
                        size: 24,
                      ),
                    ],
                  ),
                  Text(
                    txt2,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontWeight: FontWeight.w300,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          )),
    );
  }

  Widget createCopyCodeBox(String text1, String contentToCopy) {
    return GestureDetector(
      onTap: () {
        Clipboard.setData(ClipboardData(text: contentToCopy));
        showSnack(_scaffoldKey, 'Đã sao chép mã tham gia nhóm vào bộ nhớ tạm');
      },
      child: Padding(
          padding: const EdgeInsets.only(right: 10),
          child: Container(
            width: 100,
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.2),
              borderRadius: const BorderRadius.all(Radius.circular(16.0)),
            ),
            child: Padding(
              padding: const EdgeInsets.only(left: 18.0, right: 18.0, top: 12.0, bottom: 12.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.forward_to_inbox,
                        color: Colors.amber,
                        size: 24,
                      ),
                    ],
                  ),
                  Text(
                    text1,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontWeight: FontWeight.w300,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          )),
    );
  }
}
