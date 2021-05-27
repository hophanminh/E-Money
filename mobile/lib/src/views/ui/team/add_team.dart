import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class AddTeam extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;

  const AddTeam({Key key, @required this.wrappingScaffoldKey})
      : super(key: key);

  @override
  _AddTeamState createState() => _AddTeamState();
}

class _AddTeamState extends State<AddTeam> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();

  // data section for new team

  var _nameController = TextEditingController(text: "");
  var _maxController = TextEditingController(text: "10");
  var _descriptionController = TextEditingController(text: "");

  @override
  void initState() {
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
          appBar: mySimpleAppBar('Tạo nhóm mới'),
          // backgroundColor: Colors.transparent,
          body: SingleChildScrollView(
            child: Container(
              margin: const EdgeInsets.fromLTRB(20, 0, 20, 20),
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
                            margin: EdgeInsets.symmetric(vertical: 10),
                            child: TextFormField(
                              controller: _nameController,
                              decoration: myInputDecoration('Tên nhóm',
                                  inputBorder: Colors.black26),
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
                            margin: EdgeInsets.symmetric(vertical: 10),
                            child: TextFormField(
                              controller: _maxController,
                              keyboardType: TextInputType.number,
                              decoration: myInputDecoration(
                                  'Số thành viên tối đa',
                                  inputBorder: Colors.black26),
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
                            margin: EdgeInsets.symmetric(vertical: 10),
                            child: TextFormField(
                              maxLines: 5,
                              maxLength: 500,
                              controller: _descriptionController,
                              decoration: myInputDecoration('Mô tả',
                                  inputBorder: Colors.black26),
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
                  myFullWidthButton('Tạo nhóm', backgroundColor: primary,
                      action: () {
                    if (_formKey.currentState.validate()) {
                      showSnack(_scaffoldKey, 'Đang xử lý...');
                      handleAddTeam();
                    }
                  })
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void handleAddTeam() async {
    FocusScope.of(context).unfocus();
    String name = _nameController.text;
    String max = _maxController.text;
    String description = _descriptionController.text;
    Response res = await TeamService.instance.addTeam(name, max, description);

    if (res.statusCode == 201) {
      await Future.delayed(const Duration(seconds: 1), () {});
      Navigator.pop(context, true); // trở về private wallet
      showSnack(widget.wrappingScaffoldKey, "Tạo nhóm thành công");
      //_infoInit = info;
    } else {
      Map<String, dynamic> body = jsonDecode(res.body);
      showSnack(_scaffoldKey, body['msg']);
    }
  }
}
