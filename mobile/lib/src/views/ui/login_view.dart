import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/restapiservices/auth_service.dart';
import 'package:mobile/src/services/secure_storage_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/UsersProvider.dart';

class LoginPage extends StatefulWidget {
  final void Function(Map<String, dynamic>) setUser;

  const LoginPage({this.setUser});

  // LoginPage({Key key, this.title}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final GlobalKey<ScaffoldMessengerState> _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    super.initState();
  }

  void handleLogin() async {
    FocusScope.of(context).unfocus();
     http.Response res = await AuthService.instance
         .signin(usernameController.text, passwordController.text);
    //http.Response res = await AuthService.instance.signin("admin", "123456");

    Map<String, dynamic> body = jsonDecode(res.body);

    if (res.statusCode != 200) {
      showSnack(_scaffoldKey, body['msg']);
      return;
    }
    await SecureStorage.writeSecureData('jwtToken', body['token']);
    await SecureStorage.writeSecureData('userID', body['user']['ID']);
    // need to store 'user' in global state ==> not done
    Provider.of<UsersProvider>(context, listen: false)
        .loadData(body['user'], body['token']);
    widget.setUser(body['user']);
    Navigator.pushNamedAndRemoveUntil(context, '/dashboard', (route) => false);
  }

  @override
  void dispose() {
    // Clean up the controller when the widget is disposed.
    usernameController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
    ));
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        // appBar: AppBar(
        //   // Here we take the value from the MyHomePage object that was created by
        //   // the App.build method, and use it to set our appbar title.
        //   title: Text(widget.title),
        // ),
        body: SingleChildScrollView(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                Container(
                  color: primary,
                  child: ClipRRect(
                    borderRadius: BorderRadius.only(bottomLeft: Radius.circular(70.0), bottomRight: Radius.circular(70.0)),
                    child: Image(
                      image: AssetImage('assets/images/money_saving.png'),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(25, 45, 25, 25),
                  decoration: BoxDecoration(
                      border: Border.all(width: 0, color: primary),
                      gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [primary, Colors.lightGreenAccent]),
                      borderRadius: BorderRadius.only(bottomLeft: Radius.circular(70.0), bottomRight: Radius.circular(70.0))),
                  child: Center(
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Row(mainAxisAlignment: MainAxisAlignment.center, children: <Widget>[
                              Container(
                                padding: EdgeInsets.only(bottom: 30, right: 10),
                                child: Text(
                                  'E-Money',
                                  style: TextStyle(fontSize: 35, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                              ),
                              Container(
                                padding: EdgeInsets.only(bottom: 30, left: 10),
                                child: Text('Làm chủ tương lai', style: TextStyle(fontSize: 35, color: Colors.white)),
                              )
                            ]),
                          ),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                            child: TextFormField(
                              controller: usernameController,
                              decoration: myInputDecoration('Tên tài khoản', inputBorder: Colors.transparent),
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
                              padding: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                              child: TextFormField(
                                  controller: passwordController,
                                  obscureText: true,
                                  decoration: myInputDecoration('Mật khẩu', inputBorder: Colors.transparent),
                                  validator: (String value) {
                                    if (value == null || value.isEmpty || value.length < Properties.PASSWORD_MIN_LENGTH) {
                                      return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                                    }
                                    if (value.contains(' ')) {
                                      return 'Mật khẩu không được chứa khoảng trắng';
                                    }
                                    return null;
                                  })),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              TextButton(
                                child: Text('Quên mật khẩu?', style: TextStyle(color: Colors.white)),
                                onPressed: () {
                                  Navigator.pushNamed(context, '/forgotpassword');
                                },
                              ),
                              // TextButton(
                              //   child: Text('Đăng ký', style: TextStyle(color: Colors.white)),
                              //   onPressed: () {
                              //     Navigator.pushNamed(context, '/register');
                              //   },
                              // )
                            ],
                          ),
                          Padding(
                            padding: EdgeInsets.only(top: 10.0),
                            child: myAlignedButton(
                              'Đăng nhập',
                              action: () {
                                if (_formKey.currentState.validate()) {
                                  showSnack(_scaffoldKey, 'Đang xử lý...');
                                  handleLogin();
                                }
                              },
                              borderSide: BorderSide(color: Colors.white, width: 2.0),
                              // backgroundColor: Colors.transparent
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
