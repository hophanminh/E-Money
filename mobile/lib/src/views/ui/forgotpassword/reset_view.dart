import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class ResetDestination extends StatefulWidget {
  @override
  _ResetDestinationState createState() => _ResetDestinationState();
}

class _ResetDestinationState extends State<ResetDestination> {
  final verificationCodeController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmationPasswordController = TextEditingController();

  void handleSendRequest() {
    Navigator.pushNamedAndRemoveUntil(context, '/', (r) => false); // go back to login page but not allow to return this page
  }

  @override
  void dispose() {
    verificationCodeController.dispose();
    passwordController.dispose();
    verificationCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
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
                      Text('Bước 2: nhập mã xác thực nhận được trong email', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
                      Container(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 30),
                          // decoration: BoxDecoration(boxShadow: [myShadow()]),
                          child: TextFormField(
                            controller: verificationCodeController,
                            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                            autofocus: true,
                            decoration: myInputDecoration('Mã xác nhận'),
                            validator: (String value) {
                              if (value.length != 6) {
                                return 'Mã xác thực gồm 6 ký tự';
                              }
                              return null;
                            },
                          )),
                      Align(alignment: Alignment.centerLeft, child: Text('Bước 3: nhập mật khẩu mới', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17))),
                      Container(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          // decoration: BoxDecoration(boxShadow: [myShadow()]),
                          child: TextFormField(
                              controller: passwordController,
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
                      Container(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          // decoration: BoxDecoration(boxShadow: [myShadow()]),
                          child: TextFormField(
                              controller: confirmationPasswordController,
                              decoration: myInputDecoration('Xác nhận mật khẩu'),
                              obscureText: true,
                              validator: (String value) {
                                if (value == null || value.isEmpty || value.length < Properties.PASSWORD_MIN_LENGTH) {
                                  return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                                }
                                if (value.contains(' ')) {
                                  return 'Mật khẩu không được chứa khoảng trắng';
                                }
                                if (value != passwordController.text) {
                                  return 'Mật khẩu xác nhận không khớp';
                                }
                                return null;
                              })),
                      Padding(
                        padding: const EdgeInsets.only(top: 20.0),
                        child: myAlignedButton('Gửi', padding: EdgeInsets.symmetric(horizontal: 50, vertical: 10), alignment: Alignment.centerRight, fontSize: 20, action: () {
                          if (_formKey.currentState.validate()) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Đang xử lý...')));
                            handleSendRequest();
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
}
