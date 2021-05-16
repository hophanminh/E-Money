import 'package:flutter/material.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';


class TeamWallet extends StatefulWidget {

  final Drawer sidebar;

  const TeamWallet({this.sidebar});

  @override
  _TeamWalletState createState() => _TeamWalletState();
}

class _TeamWalletState extends State<TeamWallet> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: teamWalletAppBar(),
        drawer: widget.sidebar,
        floatingActionButton: teamWalletActionButton(),
        body: Container());
  }

  AppBar teamWalletAppBar() =>
      AppBar(
        iconTheme: IconThemeData(color: Colors.white),
        title: Text('Ví nhóm', style: TextStyle(color: Colors.white)),
        actions: [
          IconButton(
            icon: Icon(
              Icons.arrow_drop_down_sharp,
              size: 30,
            ),
            onPressed: () {},
          ),
        ],
        backgroundColor: primary,
        centerTitle: true,
      );

  FloatingActionButton teamWalletActionButton() =>
      FloatingActionButton(
        // onPressed: onPressed,
        tooltip: 'Thêm giao dịch',
        child: Icon(Icons.add),
        backgroundColor: secondary,
        foregroundColor: Colors.white,
      );
}
