import 'dart:io';
import 'dart:ui';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class ChangePasswordPage extends StatefulWidget {
  @override
  _ChangePasswordPageState createState() => _ChangePasswordPageState();
}

class _ChangePasswordPageState extends State<ChangePasswordPage> {
  var _formKey = GlobalKey<FormState>();
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _currentPassController = TextEditingController();
  var _newPassController = TextEditingController();
  var _repeatPassController = TextEditingController();

  String _current;
  String _new;
  String _repeat;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _currentPassController.dispose();
    _newPassController.dispose();
    _repeatPassController.dispose();
    super.dispose();
  }

  void handleChangePassword() async {
    Response res = await UserService.instance
        .changePassword(_currentPassController.text, _newPassController.text);

    if (res.statusCode == 200) {
      Navigator.pop(context); // tắt dialog
      showSnack(
          _scaffoldKey, "Cập nhật thành công"); // hiện snack bar báo thành công
    } else {
      Map<String, dynamic> body = jsonDecode(res.body);
      showSnack(_scaffoldKey, body['msg']);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: mySimpleAppBar('Đổi mật khẩu'),
        body: SingleChildScrollView(
          physics: NeverScrollableScrollPhysics(),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                decoration: BoxDecoration(
                    border: Border.all(width: 0, color: Colors.white),
                    image: DecorationImage(
                        image: AssetImage('assets/images/background1.jpg'),
                        fit: BoxFit.cover)),
                child: Container(
                  // this container is to create linear transparent background covering on the above container
                  decoration: BoxDecoration(
                    border: Border.all(width: 0, color: Colors.white),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: <Color>[
                        Colors.transparent,
                        Colors.white24,
                        Colors.white30,
                        Colors.white,
                        Colors.white
                      ],
                    ),
                  ),
                  padding: EdgeInsets.fromLTRB(20, 100, 20, 20),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Container(
                        constraints: BoxConstraints(maxWidth: 200),
                        decoration: BoxDecoration(
                            border: new Border.all(
                              color: Color(0xFF1DAF1A),
                              width: 4.0,
                            ),
                            shape: BoxShape.circle),
                        width: MediaQuery.of(context).size.width * 0.35,
                        height: MediaQuery.of(context).size.width * 0.35,
                        child: CircleAvatar(
                            maxRadius: MediaQuery.of(context).size.width * 0.20,
                            child: new Icon(Icons.lock,
                                color: Color(0xFF1DAF1A),
                                size:
                                    MediaQuery.of(context).size.width * 0.25)),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(
                    left: 30.0, right: 30.0, top: 20, bottom: 50),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      myLabelText('Mật khẩu hiện tại'),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                        child: TextFormField(
                          controller: _currentPassController,
                          obscureText: true,
                          decoration: myInputDecoration('',
                              inputBorder: Colors.black26),
                          validator: (String value) {
                            if (value == null ||
                                value.isEmpty ||
                                value.length < Properties.PASSWORD_MIN_LENGTH) {
                              return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                            }
                            if (value.contains(' ')) {
                              return 'Mật khẩu không được chứa khoảng trắng';
                            }
                            return null;
                          },
                        ),
                      ),
                      myLabelText('Mật khẩu mới'),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                        child: TextFormField(
                          controller: _newPassController,
                          obscureText: true,
                          decoration: myInputDecoration('',
                              inputBorder: Colors.black26),
                          validator: (String value) {
                            if (value == null ||
                                value.isEmpty ||
                                value.length < Properties.PASSWORD_MIN_LENGTH) {
                              return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                            }
                            if (value.contains(' ')) {
                              return 'Mật khẩu không được chứa khoảng trắng';
                            }
                            return null;
                          },
                        ),
                      ),
                      myLabelText('Nhập lại mật khẩu mới'),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                        child: TextFormField(
                          controller: _repeatPassController,
                          obscureText: true,
                          decoration: myInputDecoration('',
                              inputBorder: Colors.black26),
                          validator: (String value) {
                            if (value == null ||
                                value.isEmpty ||
                                value.length < Properties.PASSWORD_MIN_LENGTH) {
                              return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                            }
                            if (value.contains(' ')) {
                              return 'Mật khẩu không được chứa khoảng trắng';
                            }
                            if (value != _newPassController.text) {
                              return 'Mật khẩu xác nhận không khớp';
                            }
                            ;
                            return null;
                          },
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 10.0, bottom: 10),
                        child: myFullWidthButton('Đổi mật khẩu',
                            alignment: Alignment.centerRight, action: () {
                          if (_formKey.currentState.validate()) {
                            showSnack(_scaffoldKey, 'Đang xử lý...');
                            handleChangePassword();
                          }
                        }),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
