import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class ChangePasswordDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;

  const ChangePasswordDialog({Key key, this.wrappingScaffoldKey}) : super(key: key);

  @override
  _ChangePasswordDialogState createState() => _ChangePasswordDialogState();
}

class _ChangePasswordDialogState extends State<ChangePasswordDialog> {
  var _formKey = GlobalKey<FormState>();
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _oldPassword = TextEditingController();
  var _newPassword = TextEditingController();
  var _confirmingPassword = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          elevation: 0,
          backgroundColor: Colors.white,
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(15, 0, 15, 20),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Align(
                      alignment: Alignment.centerRight,
                      child: IconButton(
                        icon: Icon(Icons.close),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 15.0),
                      child: Text(
                        'Đổi mật khẩu',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                      ),
                    ),
                    myLabelText('Mật khẩu hiện tại'),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                      child: TextFormField(
                        controller: _oldPassword,
                        // autofocus: true,
                        obscureText: true,
                        decoration: myInputDecoration('Mật khẩu cũ', inputBorder: Colors.black26),
                        validator: (String value) {
                          if (value == null || value.isEmpty || value.length < Properties.PASSWORD_MIN_LENGTH) {
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
                        controller: _newPassword,
                        // autofocus: true,
                        obscureText: true,
                        decoration: myInputDecoration('Mật khẩu mới', inputBorder: Colors.black26),
                        validator: (String value) {
                          if (value == null || value.isEmpty || value.length < Properties.PASSWORD_MIN_LENGTH) {
                            return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                          }
                          if (value.contains(' ')) {
                            return 'Mật khẩu không được chứa khoảng trắng';
                          }
                          return null;
                        },
                      ),
                    ),
                    myLabelText('Xác nhận mật khẩu mới'),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(0, 10, 0, 20),
                      child: TextFormField(
                        controller: _confirmingPassword,
                        // autofocus: true,
                        obscureText: true,
                        decoration: myInputDecoration('Xác nhận mật khẩu', inputBorder: Colors.black26),
                        validator: (String value) {
                          if (value == null || value.isEmpty || value.length < 6) {
                            return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                          }
                          // if (value.contains(' ')) {
                          //   return 'Mật khẩu không được chứa khoảng trắng';
                          // }
                          if (value != _newPassword.text) return 'Mật khẩu xác nhận không khớp';
                          return null;
                        },
                      ),
                    ),
                    myAlignedButton('Xác nhận', backgroundColor: warning, action: () {
                      if (_formKey.currentState.validate()) {
                        FocusScope.of(context).unfocus();
                        showSnack(_scaffoldKey, 'Đang xử lý...');
                        handleChangePassword();
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

  void handleChangePassword() async {
    Response res = await UserService.instance.changePassword(_oldPassword.text, _newPassword.text);

    if (res.statusCode == 200) {
      Navigator.pop(context); // tắt dialog
      showSnack(widget.wrappingScaffoldKey, "Cập nhật thành công"); // hiện snack bar báo thành công
    } else {
      Map<String, dynamic> body = jsonDecode(res.body);
      showSnack(_scaffoldKey, body['msg']);
    }
  }
}
