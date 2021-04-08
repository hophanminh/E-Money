import 'package:flutter/material.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: myViceAppBar('Hồ sơ cá nhân'),
      body: Container(
        child: Text('cmm'),
      ),
    );
  }
}
