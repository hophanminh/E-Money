import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/services/restapiservices/auth_service.dart';

class AuthenPage extends StatefulWidget {
  @override
  _AuthenPageState createState() => _AuthenPageState();
}

class _AuthenPageState extends State<AuthenPage> with TickerProviderStateMixin {
  AnimationController _controller;
  Animation<Offset> _animation1;
  Animation<Offset> _animation2;

  @override
  void initState()  {
    _controller = AnimationController(
      duration: const Duration(seconds: 1),
      vsync: this,
    )..forward();

    _animation1 = Tween<Offset>(
      begin: const Offset(0.0, 0.0),
      end: const Offset(0.4, 0.0),
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInCubic,
    ));

    _animation2 = Tween<Offset>(
      begin: const Offset(-0.5, 0.0),
      end: const Offset(-0.9, 0.0),
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInCubic,
    ));
    super.initState();

    fetch();
  }

  void fetch() async {
    await Future.delayed(const Duration(seconds: 3), (){});
    Response res = await AuthService.instance.fetchInfo();

    if (res == null || res.statusCode != 200) {
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
      return;
    }

    Map<String, dynamic> body = jsonDecode(res.body);
    // print(body['user']);
    // need to store 'user' in global state ==> not done
    Navigator.pushNamedAndRemoveUntil(context, '/dashboard', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Builder(
        builder: (context) => Container(
          padding: const EdgeInsets.only(left: 50, right: 50),
          // decoration: BoxDecoration(color: Colors.white),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.only(bottom: 50.0),
                  child: Stack(
                    alignment: AlignmentDirectional.center,
                    children: [
                      SlideTransition(
                        position: _animation1,
                        child: Container(
                          width: MediaQuery.of(context).size.width / 2.6,
                          height: MediaQuery.of(context).size.width / 4,
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              'E-Money',
                              textAlign: TextAlign.left,
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 450),
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
                LinearProgressIndicator(backgroundColor: primary),
                Padding(
                  padding: const EdgeInsets.only(top: 20.0),
                  child: Text('Hãy chờ trong giây lát...'),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
