import 'package:flutter/material.dart';
import 'package:mobile/src/views/ui/auth_view.dart';
import 'package:mobile/src/views/ui/forgotpassword/generate_request_view.dart';
import 'package:mobile/src/views/ui/forgotpassword/reset_view.dart';
import 'package:mobile/src/views/ui/login_view.dart';
import 'package:mobile/src/views/ui/profile/change_password.dart';
import 'package:mobile/src/views/ui/profile/profile_view.dart';
import 'package:mobile/src/views/ui/register_view.dart';
import 'package:mobile/src/views/ui/team/team_list.dart';
import 'package:mobile/src/views/ui/wallet/dashboard_view.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/UsersProvider.dart';

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  Map<String, dynamic> user;

  void setUser(Map<String, dynamic> authenticatedUser) {
    setState(() {
      user = authenticatedUser;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (_) => UsersProvider(),
          )
        ],
        child: MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Flutter Demo',
          theme: ThemeData(primarySwatch: Colors.lightGreen),
          initialRoute: '/',
          routes: {
            '/': (context) => AuthenPage(setUser: setUser),
            '/login': (context) => LoginPage(setUser: setUser),
            '/register': (context) => RegisterPage(),
            '/forgotpassword': (context) => RequestGenerator(),
            '/reset': (context) => ResetDestination(),
            '/profile': (context) => ProfilePage(),
            '/changepassword': (context) => ChangePasswordPage(),
            '/dashboard': (context) => Dashboard(user: user),
            '/team': (context) => TeamList(user: user),
          },
        ));
  }
}
