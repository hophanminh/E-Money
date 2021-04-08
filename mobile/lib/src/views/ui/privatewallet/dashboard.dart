import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  bool isChoosingPrivateWallet = true;

  void handleChangeWallet(bool privateWallet) {
    setState(() {
      isChoosingPrivateWallet = privateWallet;
    });
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(statusBarColor: Colors.transparent));
    return ScaffoldMessenger(
      child: Scaffold(
        appBar: myPrimaryAppBar(isChoosingPrivateWallet ? 'Ví cá nhân' : 'Ví nhóm'),
        drawer: mySideBar(context: context, isChoosingPrivateWallet: isChoosingPrivateWallet, callback: handleChangeWallet),
        floatingActionButton: FloatingActionButton(
          // onPressed: _incrementCounter,
          tooltip: 'Thêm giao dịch',
          child: Icon(Icons.add),
          backgroundColor: secondary,
          foregroundColor: Colors.white,
        ),
      ),
    );
  }
}
