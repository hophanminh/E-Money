import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class IndividualWallet extends StatefulWidget {
  final Drawer sidebar;
  final Map<String, dynamic> user;

  const IndividualWallet({this.sidebar, this.user});

  @override
  _IndividualWalletState createState() => _IndividualWalletState();
}

class _IndividualWalletState extends State<IndividualWallet> {
  Map<String, dynamic> _txnList;

  @override
  void initState() {
    // _getSocket();
    // _socket = IO.io('http://192.168.1.93:9000', IO.OptionBuilder().setTransports(['polling']).disableAutoConnect().setQuery({'token': 'xmmm'}).build());
    super.initState();
    connectToServer();
  }

  void connectToServer() async {
    try {
      print('cmm');

      // IO.Socket socket = IO.io(
      //     'http://192.168.1.31:9000',
      //     IO.OptionBuilder().setTransports(['websocket']).setQuery(
      //         {'token': "secretkey"}).build());
      //
      // socket.on('connect', (_) {
      //   print('connect');
      // });
      //
      // socket.onConnect((data) {
      //   print("connected");
      //   socket.emit("message");
      // });
      // socket.onDisconnect((data) => print("disconnected"));
      // socket.onConnectError((data) => print("connect_error: $data"));

    } catch (err) {
      print('Caught error: $err');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: privateWalletAppBar(),
        drawer: widget.sidebar,
        floatingActionButton: privateWalletActionButton(),
        body: Container(
          padding: EdgeInsets.all(20),
          child: Center(
            child: Column(
              children: [
                Container(
                  padding: EdgeInsets.all(20),
                  margin: EdgeInsets.only(bottom: 20),
                  width: MediaQuery.of(context).size.width,
                  decoration: BoxDecoration(
                      gradient: LinearGradient(begin: Alignment.bottomLeft, end: Alignment.topRight, colors: [primary, Colors.lightGreenAccent]),
                      borderRadius: BorderRadius.circular(12)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Tổng số dư: ',
                        style: TextStyle(fontSize: 20, color: Colors.white),
                      ),
                      Text(
                        '123 VNĐ',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(15),
                  child: Text('Báo cáo nhanh tháng 5/2021', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                ),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(border: Border(right: BorderSide(width: 1, color: Colors.grey))),
                        alignment: Alignment.center,
                        child: Column(
                          children: [
                            Text('Tổng thu tháng 5/2021'),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Text(
                                '999,999,999đ',
                                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green, fontSize: 21),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Expanded(
                      child: Column(
                        children: [
                          Container(
                            alignment: Alignment.center,
                            child: Column(
                              children: [
                                Text('Tổng chi tháng 05/2021'),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    '999,999,999đ',
                                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red, fontSize: 21),
                                  ),
                                )
                              ],
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
                Text(_txnList.toString())
              ],
            ),
          ),
        ));
  }

  AppBar privateWalletAppBar() => AppBar(
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Ví cá nhân', style: TextStyle(color: Colors.white)),
      actions: [
        IconButton(
          icon: Icon(Icons.arrow_drop_down_sharp, size: 30),
          onPressed: () {},
        )
      ],
      backgroundColor: primary,
      centerTitle: true);

  FloatingActionButton privateWalletActionButton() => FloatingActionButton(
      // onPressed: onPressed,
      tooltip: 'Thêm giao dịch',
      child: Icon(Icons.add),
      backgroundColor: secondary,
      foregroundColor: Colors.white);
}
