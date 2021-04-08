import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/src/views/ui/wallet/privatewallet/private_wallet.dart';
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
        appBar: isChoosingPrivateWallet ? privateWalletAppBar() : null, // replace null by team appbar widget in the future
        drawer: mySideBar(context: context, isChoosingPrivateWallet: isChoosingPrivateWallet, callback: handleChangeWallet),
        floatingActionButton: isChoosingPrivateWallet == true ? privateWalletActionButton() : null, // we must replace the null with teamWalletActionBtn later
      ),
    );
  }
}
