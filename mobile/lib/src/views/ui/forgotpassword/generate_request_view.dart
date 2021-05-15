import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/services/restapiservices/auth_service.dart';
import 'package:mobile/src/views/ui/forgotpassword/reset_view.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class RequestGenerator extends StatefulWidget {
  @override
  _RequestGeneratorState createState() => _RequestGeneratorState();
}

class _RequestGeneratorState extends State<RequestGenerator> {
  var _usernameController = TextEditingController(text: 'minhlac');
  var _emailController = TextEditingController(text: 'lactuanminh2121@gmail.com');
  var _formKey = GlobalKey<FormState>();
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  void handleSendRequest() async {
    FocusScope.of(context).unfocus();
    Response res = await AuthService.instance.forgotPassword(_usernameController.text, _emailController.text);
    Map<String, dynamic> body = jsonDecode(res.body);
    if (res.statusCode == 200) {
      showSnackV2(context, 'Hãy kiểm tra email để nhận mã xác nhận', /*action: closeSnackActionV2(context),*/ duration: 5); // action not work when navigate to second page
      print('28');
      print(body['id']);
      Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => ResetDestination(resetID: body['id'])));
    } else {
      showSnack(_scaffoldKey, body['msg']);
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              decoration: BoxDecoration(
                  border: Border.all(width: 0, color: primary),
                  color: primary,
                  borderRadius: BorderRadius.only(bottomLeft: Radius.circular(70.0), bottomRight: Radius.circular(70.0))),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 20, top: 20, bottom: 15),
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        'E-Money',
                        style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(left: 45, bottom: 15),
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        'Đặt lại mật khẩu',
                        style: TextStyle(fontSize: 35, color: Colors.white),
                      ),
                    ),
                  )
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 50, left: 30, right: 30),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    Text('Bước 1: nhập tên tài khoản và email dể nhận mã xác thực', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
                    Container(
                        padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                        // decoration: BoxDecoration(boxShadow: [myShadow()]),
                        child: TextFormField(
                          controller: _usernameController,
                          autofocus: true,
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
                        )),
                    Container(
                        padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                        // decoration: BoxDecoration(boxShadow: [myShadow()]),
                        child: TextFormField(
                            controller: _emailController,
                            decoration: myInputDecoration('Email'),
                            validator: (String value) {
                              if (value == null || value.isEmpty) {
                                return 'Email không được để trống';
                              }
                              if (isEmailPattern(value) == false) {
                                return 'Email không hợp lệ';
                              }
                              return null;
                            })),
                    myAlignedButton('Gửi', alignment: Alignment.centerRight, padding: EdgeInsets.symmetric(horizontal: 50, vertical: 10), fontSize: 20, action: () {
                      if (_formKey.currentState.validate()) {
                        showSnackV2(context, 'Đang xử lý...', duration: -1);
                        handleSendRequest();
                      }
                    }),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
