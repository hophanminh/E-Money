import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';

class EditTeam extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final Teams team;

  const EditTeam(
      {Key key, @required this.team, @required this.wrappingScaffoldKey})
      : super(key: key);

  @override
  _EditTeamState createState() => _EditTeamState();
}

class _EditTeamState extends State<EditTeam> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();
  Teams team;

  // data section for new team

  var _nameController = TextEditingController(text: "");
  var _maxController = TextEditingController(text: "10");
  var _descriptionController = TextEditingController(text: "");

  void setData() {
    _nameController.text = widget.team.name;
    _maxController.text = widget.team.maxUsers.toString();
    _descriptionController.text = widget.team.description;

  }

  @override
  void initState() {
    setData();
    super.initState();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _maxController.dispose();
    _descriptionController.dispose();
    super.dispose();
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
          appBar: _appBar(),
          // backgroundColor: Colors.transparent,
          body: RefreshIndicator(
            onRefresh: () => Future.delayed(Duration(milliseconds: 500), () {
              FocusScope.of(context).unfocus();
              setData();
            }),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Container(
                margin: const EdgeInsets.fromLTRB(20, 10, 20, 20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 10, bottom: 0.0),
                      child: Form(
                        autovalidateMode: AutovalidateMode.onUserInteraction,
                        key: _formKey,
                        child: Column(
                          children: [
                            Container(
                              margin: EdgeInsets.symmetric(vertical: 15),
                              child: TextFormField(
                                controller: _nameController,
                                decoration: myInputDecoration('',
                                    inputBorder: Colors.black26, label: 'Tên nhóm'),
                                validator: (String value) {
                                  if (value == null || value.isEmpty || isBlankString(value)) {
                                    return 'Tên không được để trống';
                                  }
                                  if (value.length > 30) {
                                    return 'Tên không được quá 30 ký tự';
                                  }
                                  return null;
                                },
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.symmetric(vertical: 15),
                              child: TextFormField(
                                controller: _maxController,
                                keyboardType: TextInputType.number,
                                decoration: myInputDecoration(
                                    '',
                                    inputBorder: Colors.black26, label: 'Số người tối đa',),
                                inputFormatters: <TextInputFormatter>[
                                  FilteringTextInputFormatter.digitsOnly
                                ],
                                validator: (String value) {
                                  if (value == null || value.isEmpty || isBlankString(value)) {
                                    return 'Số người tối đa không được để trống';
                                  }
                                  if (int.parse(value) > 200) {
                                    return 'Chỉ cho phép tối đa 200 người';
                                  }
                                  if (int.parse(value) <= 0) {
                                    return 'Số người tối đa không được là 0';
                                  }
                                  return null;
                                },
                              ),
                            ),
                            Container(
                              margin: EdgeInsets.symmetric(vertical: 15),
                              child: TextFormField(
                                maxLines: 5,
                                maxLength: 500,
                                controller: _descriptionController,
                                decoration: myInputDecoration('',
                                    inputBorder: Colors.black26, label: 'Mô tả',),
                                validator: (String value) {
                                  if (value.length > 500) {
                                    return 'Mô tả không được quá 500 ký tự';
                                  }
                                  return null;
                                },
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    myFullWidthButton('Thay đổi', backgroundColor: primary,
                        action: () {
                      if (_formKey.currentState.validate()) {
                        showSnack(_scaffoldKey, 'Đang xử lý...');
                        handleEditTeam();
                      }
                    })
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  AppBar _appBar() => AppBar(
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Danh sách nhóm', style: TextStyle(color: Colors.white)),
      backgroundColor: primary,
      centerTitle: true);

  void handleEditTeam() async {
    FocusManager.instance.primaryFocus.unfocus();
    String name = _nameController.text;
    String max = _maxController.text;
    String description = _descriptionController.text;
    String teamId = widget.team.id;

    Response res =
        await TeamService.instance.editTeam(name, max, description, teamId);
    print(res.statusCode);
    print(res.body);
    if (res.statusCode == 200) {
      Provider.of<TeamsProvider>(context, listen: false).fetchData();
      Navigator.pop(context, true); // trở về private wallet
      showSnack(widget.wrappingScaffoldKey, "Thay đổi thành công");
      //_infoInit = info;
    } else {
      Map<String, dynamic> body = jsonDecode(res.body);
      showSnack(_scaffoldKey, body['msg']);
    }
  }
}
