import 'package:flutter/material.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';

FloatingActionButton privateWalletActionButton() => FloatingActionButton(
  // onPressed: onPressed,
  tooltip: 'Thêm giao dịch',
  child: Icon(Icons.add),
  backgroundColor: secondary,
  foregroundColor: Colors.white,
);

AppBar privateWalletAppBar() => AppBar(
  iconTheme: IconThemeData(color: Colors.white),
  title: Text('Ví cá nhân', style: TextStyle(color: Colors.white)),
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