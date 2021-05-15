import 'dart:convert';
import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/restapiservices/auth_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();
  var _usernameController = TextEditingController();
  var _nameController = TextEditingController();
  var _emailController = TextEditingController();
  var _passwordController = TextEditingController();
  var _confirmingPasswordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    // SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    //   statusBarColor: Colors.black12,
    // ));

    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        body: SingleChildScrollView(
          child: Column(
            children: [
              ClipPath(
                  clipper: _CustomHalfCircleClipper(),
                  child: Container(
                    decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.bottomLeft, end: Alignment.topRight, colors: [Colors.yellowAccent, primary])),
                    width: MediaQuery.of(context).size.width,
                    height: 350,
                    child: Container(
                      constraints: BoxConstraints(maxHeight: 350 * 0.78),
                      margin: EdgeInsets.fromLTRB(35, 350 * 0.78 * 0.3, 35, 0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Container(
                                  width: MediaQuery.of(context).size.width * 0.4,
                                  height: MediaQuery.of(context).size.width * 0.4,
                                  constraints: BoxConstraints(maxHeight: 350 * 0.78 * 0.7, maxWidth: 350 * 0.78 * 0.7),
                                  margin: EdgeInsets.only(right: 0),
                                  decoration: BoxDecoration(
                                    image: DecorationImage(image: AssetImage('assets/images/money_saving.png'), fit: BoxFit.cover),
                                    borderRadius: BorderRadius.all(Radius.circular(20)),
                                  ),
                                )
                              ],
                            ),
                          ),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(left: 20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.start,
                                children: [
                                  FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Text(
                                      'E-Money',
                                      style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white),
                                    ),
                                  ),
                                  FittedBox(
                                    fit: BoxFit.scaleDown,
                                    child: Text(
                                      'Làm chủ tương lai',
                                      style: TextStyle(fontSize: 31, color: Colors.white70),
                                    ),
                                  )
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )),
              Container(
                constraints: BoxConstraints(maxWidth: 500),
                width: MediaQuery.of(context).size.width * 0.9,
                padding: EdgeInsets.symmetric(horizontal: 10),
                margin: EdgeInsets.only(bottom: 70),
                child: Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      FittedBox(
                          child: Text(
                        'Tạo tài khoản',
                        style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold, color: Colors.black54),
                      )),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(0, 15, 0, 10),
                        child: TextFormField(
                          controller: _usernameController,
                          decoration: myInputDecoration('Tên tài khoản'),
                          validator: (String value) {
                            if (value == null || value.isEmpty) {
                              return 'Tên tài khoản không được để trống';
                            }
                            if (value.contains(' ')) {
                              return 'Tên tài khoản không được chứa khoảng trắng';
                            }
                            return null;
                          },
                        ),
                      ),
                      Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                              controller: _nameController,
                              decoration: myInputDecoration('Tên hiển thị'),
                              validator: (String value) {
                                if (value == null || value.isEmpty) {
                                  return 'Tên không được để trống';
                                }
                                if (isBlankString(value)) {
                                  return 'Tên chỉ chứa khoảng trắng';
                                }
                                return null;
                              })),
                      Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                              controller: _emailController,
                              decoration: myInputDecoration('Email'),
                              validator: (String value) {
                                if (value.isEmpty) {
                                  return 'Email không được để trống';
                                }
                                if (isEmailPattern(value) == false) {
                                  return 'Email không hợp lệ';
                                }
                                return null;
                              })),
                      Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                              controller: _passwordController,
                              obscureText: true,
                              decoration: myInputDecoration('Mật khẩu'),
                              validator: (String value) {
                                if (value == null || value.isEmpty || value.length < Properties.PASSWORD_MIN_LENGTH) {
                                  return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                                }
                                if (value.contains(' ')) {
                                  return 'Mật khẩu không được chứa khoảng trắng';
                                }
                                return null;
                              })),
                      Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                              controller: _confirmingPasswordController,
                              obscureText: true,
                              decoration: myInputDecoration('Xác nhận mật khẩu'),
                              validator: (String value) {
                                if (value == null || value.isEmpty || value.length < 6) {
                                  return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                                }
                                // if (value.contains(' ')) {
                                //   return 'Mật khẩu không được chứa khoảng trắng';
                                // }
                                if (value != _passwordController.text) return 'Mật khẩu xác nhận không khớp';
                                return null;
                              })),
                      Padding(
                        padding: EdgeInsets.only(top: 20.0),
                        child: myAlignedButton('Đăng ký', borderSide: BorderSide(color: primary, width: 1.0), action: () {
                          if (_formKey.currentState.validate()) {
                            showSnack(_scaffoldKey, 'Đang xử lý...', duration: -1);
                            handleRegister();
                          }
                        }),
                      )
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  void handleRegister() async {
    FocusScope.of(context).unfocus();
    Response res = await AuthService.instance.signup(_usernameController.text, _nameController.text, _passwordController.text, _emailController.text);
    Map<String, dynamic> body = jsonDecode(res.body);

    if (res.statusCode == 201) {
      showSnack(_scaffoldKey, body['msg'],
          duration: -1,
          action: closeSnackAction(_scaffoldKey));
    } else {
      showSnack(_scaffoldKey, body['msg'], duration: 5);
    }
    // Navigator.pushNamedAndRemoveUntil(context, '/dashboard', (route) => false);
  }
}

class _CustomHalfCircleClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    final height = size.height;
    var path = new Path();
    var firstControlPoint = new Offset(size.width / 4, height);
    var firstEndPoint = new Offset(size.width / 2, height * 0.8);
    var secondControlPoint = new Offset(size.width - (size.width / 4), height * 0.6);
    var secondEndPoint = new Offset(size.width, height * 0.56);

    path.lineTo(0, height * 0.7);
    path.quadraticBezierTo(firstControlPoint.dx, firstControlPoint.dy, firstEndPoint.dx, firstEndPoint.dy);
    path.quadraticBezierTo(secondControlPoint.dx, secondControlPoint.dy, secondEndPoint.dx, secondEndPoint.dy);
    path.lineTo(size.width, 0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) {
    return true;
  }
}
