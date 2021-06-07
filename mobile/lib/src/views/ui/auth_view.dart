import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/services/restapiservices/auth_service.dart';
import 'package:mobile/src/services/secure_storage_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:provider/provider.dart';

class AuthenPage extends StatefulWidget {
  final void Function(Map<String, dynamic>) setUser;

  AuthenPage({Key key, this.setUser}) : super(key: key);

  @override
  _AuthenPageState createState() => _AuthenPageState();
}

class _AuthenPageState extends State<AuthenPage> with TickerProviderStateMixin {
  AnimationController _controller;
  Animation<Offset> _animation1;
  Animation<Offset> _animation2;
  String authenMessage = 'Hãy chờ trong giây lát...';

  // Map<String, dynamic> _user;

  @override
  void initState() {
    _controller = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    )..forward();

    _animation1 = Tween<Offset>(
      begin: const Offset(-0.05, 0.0),
      end: const Offset(0.45, 0.0),
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInCubic,
    ));

    _animation2 = Tween<Offset>(
      begin: const Offset(-0.3, 0.0),
      end: const Offset(-0.8, 0.0),
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInCubic,
    ));
    super.initState();
    fetch();
  }

  void fetch() async {
    // return;
    await Future.delayed(const Duration(seconds: 3), () {});
    Response res = await AuthService.instance.fetchInfo();

    if (res == null || res.statusCode != 200) {
      await SecureStorage.deleteAllSecureData();
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
      return;
    }

    Map<String, dynamic> body = jsonDecode(res.body);
    print(body['user']);
    Provider.of<UsersProvider>(context, listen: false)
        .loadData(body['user'], body['token']);
    setState(() {
      widget.setUser(new Map<String, dynamic>.from(body['user']));
    });
    Navigator.pushNamedAndRemoveUntil(context, '/dashboard', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Builder(
        builder: (context) => SingleChildScrollView(
          child: Container(
            height: MediaQuery.of(context).size.height,
            padding: const EdgeInsets.only(left: 50, right: 50),
            decoration: BoxDecoration(gradient: SweepGradient(center: Alignment.center, colors: [primary, Colors.yellow])),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    // color: Colors.white,
                    padding: const EdgeInsets.only(bottom: 50.0),
                    child: Stack(
                      alignment: AlignmentDirectional.center,
                      children: [
                        SlideTransition(
                          position: _animation1,
                          child: Container(
                            width: MediaQuery.of(context).size.width / 2.6,
                            height: MediaQuery.of(context).size.width / 4,
                            constraints: BoxConstraints(maxWidth: 200),
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Text(
                                'E-Money',
                                textAlign: TextAlign.left,
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 40, color: Colors.white),
                              ),
                            ),
                          ),
                        ),
                        // Positioned(
                        //   child: Container(width: MediaQuery.of(context).size.width / 2.6, height: MediaQuery.of(context).size.width / 4, decoration: BoxDecoration(color: Colors.white),),
                        //   left: 0,
                        // ),
                        SlideTransition(
                          position: _animation2,
                          child: Container(
                            width: MediaQuery.of(context).size.width / 3.8,
                            height: MediaQuery.of(context).size.width / 4,
                            constraints: BoxConstraints(maxWidth: 200, maxHeight: 200),
                            child: FittedBox(
                              fit: BoxFit.fill,
                              child: ClipRRect(
                                borderRadius: BorderRadius.all(Radius.circular(100.0)),
                                child: Image.asset('assets/images/money_saving.png'),
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                  LinearProgressIndicator(backgroundColor: Colors.white),
                  Padding(
                    padding: const EdgeInsets.only(top: 20.0),
                    child: Text(
                      authenMessage,
                      style: TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
