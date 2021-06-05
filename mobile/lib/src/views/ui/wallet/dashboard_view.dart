import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/src/views/ui/team/team_list.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/private_wallet.dart';
import 'package:mobile/src/views/ui/wallet/team_wallet/team_wallet.dart';
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
  String mainRouteName = 'privateWallet';

  @override
  void initState() {
    super.initState();
  }

  void setMainRoute(String name) {
    setState(() {
      mainRouteName = name;
    });
  }

  // confirm exit app or not
  Future<bool> _onWillPop() async {
    return (await showDialog(
      context: context,
      builder: (context) => new AlertDialog(
        title: new Text('Xác nhận'),
        content: new Text('Bạn có chắc chắn muốn thoát khỏi ứng dụng?'),
        actions: <Widget>[
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: new Text('Hủy'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: new Text('Xác nhận'),
          ),
        ],
      ),
    )) ?? false;
  }


  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
        SystemUiOverlayStyle(statusBarColor: Colors.transparent));
    Drawer sideBar = mySideBar(
        context: context, name: widget.user['Name'], avatarURL: widget.user['AvatarURL'], setMainRoute: setMainRoute, mainRouteName: mainRouteName);

    return WillPopScope(
      onWillPop: _onWillPop,
      child: ScaffoldMessenger(
          child: createDashboardPage(sideBar)
      ),
    );
  }

  Widget createDashboardPage(sidebar) {
    if (mainRouteName == 'privateWallet') {
      return IndividualWallet(sidebar: sidebar);
    }
    else if (mainRouteName == 'teamWallet') {
      return TeamWallet(sidebar: sidebar);

    }
    else if (mainRouteName == 'teamList') {
      return TeamList(sidebar: sidebar);
    }
  }
}
