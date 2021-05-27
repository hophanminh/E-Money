import 'dart:convert';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/profile/avatar_picker_menu.dart';
import 'package:mobile/src/views/ui/team/edit_team.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class TeamDetail extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final Teams team;

  const TeamDetail(
      {Key key, @required this.team, @required this.wrappingScaffoldKey})
      : super(key: key);

  @override
  _TeamDetailState createState() => _TeamDetailState();
}

class _TeamDetailState extends State<TeamDetail> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    _initPage();
    super.initState();
  }

  _initPage() async {}

  @override
  Widget build(BuildContext context) {
    print(MediaQuery.of(context).size.height);
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: _appBar(),
        body: Padding(
          padding: const EdgeInsets.only(left: 8, right: 8, top: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Expanded(
                child: Column(children: [
                  Padding(
                    padding: const EdgeInsets.only(
                        top: 0, left: 16, bottom: 8, right: 16),
                    child: Text(
                      'Nhóm\n${widget.team.name}',
                      textAlign: TextAlign.center,
                      maxLines: 3,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 22,
                        letterSpacing: 0.27,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(
                        top: 0, left: 16, bottom: 8, right: 16),
                    child: Text(
                      'Tạo lúc:  ${convertToDDMMYYYY(widget.team.createdDate)}',
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        fontWeight: FontWeight.w300,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(
                        left: 16, right: 16, bottom: 8, top: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: <Widget>[
                        getTimeBoxUI(
                            widget.team.currentUsers.toString(), "Hiện tại"),
                        getTimeBoxUI(widget.team.maxUsers.toString(), "Tối đa"),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(
                        top: 20.0, left: 16, bottom: 8, right: 16),
                    child: Text(
                      'Mô tả',
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        fontSize: 18,
                        letterSpacing: 0.27,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(
                                  left: 16, right: 16, top: 8, bottom: 8),
                              child: Scrollbar(
                                isAlwaysShown: true,
                                child: SingleChildScrollView(
                                  child: Padding(
                                      padding: const EdgeInsets.only(right: 8),
                                      child: Container(
                                        child: Text(
                                          widget.team.description,
                                          textAlign: TextAlign.justify,
                                          style: TextStyle(
                                            fontSize: 14,
                                          ),
                                        ),
                                      )),
                                ),
                              ),
                            ),
                          ),
                        ]),
                  ),
                ]),
              ),
              Padding(
                padding: const EdgeInsets.only(
                    left: 16, top: 36, bottom: 16, right: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    GestureDetector(
                      onTap: () {},
                      child: Container(
                        width: 48,
                        height: 48,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white10,
                            borderRadius: const BorderRadius.all(
                              Radius.circular(16.0),
                            ),
                            border: Border.all(color: Colors.red),
                          ),
                          child: Icon(
                            Icons.exit_to_app,
                            color: Colors.red,
                            size: 28,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(
                      width: 16,
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () {},
                        child: Container(
                          height: 48,
                          decoration: BoxDecoration(
                            color: Colors.blue,
                            borderRadius: const BorderRadius.all(
                              Radius.circular(16.0),
                            ),
                            boxShadow: <BoxShadow>[
                              BoxShadow(
                                  color: Colors.blue.withOpacity(0.5),
                                  offset: const Offset(1.1, 1.1),
                                  blurRadius: 10.0),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              'Xem ví nhóm',
                              textAlign: TextAlign.left,
                              style: TextStyle(
                                fontWeight: FontWeight.w600,
                                fontSize: 18,
                                letterSpacing: 0.0,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ],
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
        PopupMenuButton(
          itemBuilder: (BuildContext bc) => [
            PopupMenuItem(
              value: "/edit",
              child: Row(
                children: <Widget>[
                  Icon(Icons.edit),
                  Text("Sửa thông tin"),
                ],
              ),
            ),
            PopupMenuItem(
              value: "/delete",
              child: Row(
                children: <Widget>[
                  Icon(Icons.delete),
                  Text("Xóa nhóm"),
                ],
              ),
            ),
            PopupMenuItem(
              value: "/list",
              child: Row(
                children: <Widget>[
                  Icon(Icons.people),
                  Text("Danh sách thành viên"),
                ],
              ),
            ),
          ],
          onSelected: (route) async {
            if (route == '/edit') {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => EditTeam(
                            team: widget.team,
                            wrappingScaffoldKey: _scaffoldKey,
                          )));
            }
            if (route == '/delete') {}
            if (route == '/list') {}
          },
        ),
      ],
      backgroundColor: primary,
      centerTitle: true);

  Widget getTimeBoxUI(String text1, String txt2) {
    return Padding(
        padding: const EdgeInsets.only(right: 10),
        child: Container(
          width: 100,
          decoration: BoxDecoration(
            color: Colors.grey.withOpacity(0.2),
            borderRadius: const BorderRadius.all(Radius.circular(16.0)),
          ),
          child: Padding(
            padding: const EdgeInsets.only(
                left: 18.0, right: 18.0, top: 12.0, bottom: 12.0),
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
        ));
  }
}
