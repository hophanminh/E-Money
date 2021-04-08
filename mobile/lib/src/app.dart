import 'package:flutter/material.dart';
import 'package:mobile/src/views/ui/auth_view.dart';
import 'package:mobile/src/views/ui/forgotpassword/generate_request_view.dart';
import 'package:mobile/src/views/ui/forgotpassword/reset_view.dart';
import 'package:mobile/src/views/ui/login_view.dart';
import 'package:mobile/src/views/ui/profile_view.dart';
import 'package:mobile/src/views/ui/register_view.dart';
import 'package:mobile/src/views/ui/wallet/dashboard_view.dart';

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(primarySwatch: Colors.lightGreen),
      // theme: ThemeData(scaffoldBackgroundColor: const Color(0xFF1DAF1A)),// ),
      // home: LoginPage(title: 'Flutter Demo Home Page')
      initialRoute: '/',
      routes: {
        '/': (context) => AuthenPage(),
        '/login': (context) => LoginPage(),
        '/register': (context) => RegisterPage(),
        '/forgotpassword': (context) => RequestGenerator(),
        '/reset': (context) => ResetDestination(),
        '/profile': (context) => ProfilePage(),
        '/dashboard': (context) => Dashboard(),
      },
    );
  }
}
// class MyApp extends StatefulWidget {
//   @override
//   State<StatefulWidget> createState() => _MyAppState();
// }
//
// class _MyAppState extends State<MyApp> {
//   Map<String, dynamic> palette;
//
//   @override
//   void initState() {
//     super.initState();
//     loadJson('assets/config/palette.json').then((value) =>
//     {
//       this.setState(() {
//         palette = value;
//       }),
//     });
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       debugShowCheckedModeBanner: false,
//       title: 'Flutter Demo',
//       theme: ThemeData(
//         primarySwatch:palette != null ? const Color(palette['primary']) : null, // Colors.blue // palette['primary'],
//       ),
//       home: LoginPage(title: 'Flutter Demo Home Page'),
//     );
//   }
// }
