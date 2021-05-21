import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/private_wallet.dart';
import 'package:mobile/src/views/ui/wallet/team_wallet/private_wallet.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/UsersProvider.dart';

class Dashboard extends StatefulWidget {
  final Map<String, dynamic> user;

  const Dashboard({this.user});

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  bool isChoosingPrivateWallet = true;

  @override
  void initState() {
    super.initState();
  }

  void handleChangeWallet(bool privateWallet) {
    setState(() {
      isChoosingPrivateWallet = privateWallet;
    });
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
        SystemUiOverlayStyle(statusBarColor: Colors.transparent));
    Drawer sideBar = mySideBar(
        context: context, name: widget.user['Name'], avatarURL: widget.user['AvatarURL'], isChoosingPrivateWallet: isChoosingPrivateWallet, switchWalletMode: handleChangeWallet);
    return ScaffoldMessenger(
        child: isChoosingPrivateWallet
            ? IndividualWallet(sidebar: sideBar, user: widget.user)
            : TeamWallet(
                sidebar: sideBar,
              ));
  }
}
