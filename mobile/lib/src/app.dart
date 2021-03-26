import 'package:flutter/material.dart';
import 'package:mobile/src/views/ui/login_view.dart';

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.lightGreen,
      ),
      home: LoginPage(title: 'Flutter Demo Home Page'),
    );
  }
}