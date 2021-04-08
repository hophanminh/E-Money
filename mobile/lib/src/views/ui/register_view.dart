import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class RegisterPage extends StatefulWidget {
  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
    ));

    final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

    return Scaffold(
      body: Center(
        child: Stack(
          children: <Widget>[
            Positioned(
              left: 0,
              top: 150, // (_rowKey.currentContext.findRenderObject() as RenderBox).size.height,
              width: MediaQuery.of(context).size.width,
              child: Container(
                padding: const EdgeInsets.fromLTRB(25, 75, 25, 20),
                decoration: BoxDecoration(
                    // border: Border.all(width: 0, color: const Color(0xFF1DAF1A)),
                    color: primary,
                    borderRadius: BorderRadius.only(bottomLeft: Radius.circular(70.0), bottomRight: Radius.circular(70.0))),
                child: Center(
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                            // controller: usernameController,
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
                                // controller: passwordController,
                                decoration: myInputDecoration('Tên hiển thị'),
                                validator: (String value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Tên hiển thị không được để trống';
                                  }
                                  return null;
                                })),
                        Padding(
                            padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                            child: TextFormField(
                                // controller: passwordController,
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
                                // controller: passwordController,
                                obscureText: true,
                                decoration: myInputDecoration('Mật khẩu'),
                                validator: (String value) {
                                  if (value == null || value.isEmpty || value.length < 6) {
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
                                // controller: passwordController,
                                obscureText: true,
                                decoration: myInputDecoration('Xác nhận mật khẩu'),
                                validator: (String value) {
                                  if (value == null || value.isEmpty || value.length < 6) {
                                    return 'Mật khẩu phải chứa ít nhất 6 ký tự';
                                  }
                                  if (value.contains(' ')) {
                                    return 'Mật khẩu không được chứa khoảng trắng';
                                  }
                                  // if( khác nhau)
                                  return null;
                                })),
                        Padding(
                          padding: EdgeInsets.only(top: 20.0),
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                                primary: primary,
                                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 10),
                                side: BorderSide(color: Colors.white, width: 3.0),
                                textStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 20.0)),
                            child: Text(
                              'Đăng ký',
                              style: TextStyle(color: Colors.white),
                            ),
                            onPressed: () {
                              if (_formKey.currentState.validate()) {
                                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Đang xử lý...')));
                                // handleRegister();
                              }
                            },
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
            ),
            Container(
              // height: 550,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Transform.translate(
                    offset: Offset(0, 30),
                    child: Container(
                      width: MediaQuery.of(context).size.width / 2.5,
                      height: MediaQuery.of(context).size.width / 2.5,
                      padding: EdgeInsets.only(left: 20, top: 30),
                      decoration: BoxDecoration(boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.2),
                          spreadRadius: 2,
                          blurRadius: 20,
                          offset: Offset(11, 11), // changes position of shadow
                        ),
                      ]),
                      child: FittedBox(
                        fit: BoxFit.fill,
                        child: ClipRRect(
                          borderRadius: BorderRadius.all(Radius.circular(25.0)),
                          child: Image(image: AssetImage('assets/images/money_saving.png')),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 60.0, left: 10.0, right: 20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              'E-Money',
                              style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.black54),
                            ),
                          ),
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              'Làm chủ tương lai',
                              style: TextStyle(fontSize: 35, color: Colors.black54),
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}