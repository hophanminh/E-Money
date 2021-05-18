import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/delete_transaction.dart';
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
  IO.Socket _socket;
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _txns = [];
  var _stat = new Map<String, dynamic>();
  var _categoryList = {'fullList': [], 'defaultList': [], 'customList': []};
  var iconList = [];

  void _setCategoryList(List<dynamic> fullList, List<dynamic> defaultList, List<dynamic> customList) {
    setState(() {
      _categoryList['fullList'] = fullList;
      _categoryList['defaultList'] = defaultList;
      _categoryList['customList'] = customList;
    });
  }

  void _initPage() async {
    final walletID = widget.user['WalletID'];
    iconList = jsonDecode(await WalletService.instance.getListIcon());
    // print('${iconList[0]['ID']}');

    _socket = await getSocket();

    _socket.emitWithAck('get_transaction', {'walletID': walletID}, ack: (data) {
      //{ transactionList, total, spend, receive }
      // print(data['transactionList'][0]['id']);
      setState(() {
        _txns = data['transactionList'];
        _stat = {"total": data['total'], "spend": data['spend'], "receive": data['receive']};
      });
    });

    _socket.on(
        'wait_for_update_transaction',
        (data) => {
              setState(() {
                _txns = data['transactionList'];
                _stat = {"total": data['total'], "spend": data['spend'], "receive": data['receive']};
              })
            });

    _socket.emitWithAck("get_category", {walletID: walletID},
        ack: (data) => {
              //{ defaultList, customList, fullList }
              // setAllList(defaultList, customList, fullList)
              // setState(() {
              _setCategoryList(data['fullList'], data['defaultList'], data['customList'])
              // })
            });

    _socket.on('wait_for_update_category', (data) => {_setCategoryList(data['fullList'], data['defaultList'], data['customList'])});

    // _socket.emit("get_event", { walletID: info?.WalletID}, ({ eventList }) => {
    // setEventList(eventList);
    // });
    //
    //
    // _socket.on('wait_for_update_event', ({ eventList }) => {
    // setEventList(eventList);
    // });
  }

  @override
  void initState() {
    _initPage();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
          appBar: privateWalletAppBar(),
          drawer: widget.sidebar,
          floatingActionButton: privateWalletActionButton(),
          body: SingleChildScrollView(
            child: Container(
              // height: MediaQuery.of(context).size.height,
              padding: EdgeInsets.symmetric(vertical: 20),
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
                            '${moneyFormatter(_stat['total'])}',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(15),
                      child: Text('Báo cáo nhanh 05/2021', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
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
                                    '${moneyFormatter(_stat['receive'])}',
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
                                        '${moneyFormatter(_stat['spend'])}',
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
                    Padding(
                      padding: const EdgeInsets.only(top: 40, bottom: 10),
                      child: Text('Danh sách giao dịch', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                    ),
                    for (var tx in _txns) _createCompactTxn(tx)
                  ],
                ),
              ),
            ),
          )),
    );
  }

  _createCompactTxn(Map<String, dynamic> tx) {
    var selectedIcon = iconList.firstWhere((element) => element['ID'] == tx['IconID']);
    return Card(
      child: Slidable(
        actionPane: SlidableDrawerActionPane(),
        actionExtentRatio: 0.25,
        secondaryActions: <Widget>[
          new IconSlideAction(
            caption: 'Xóa',
            color: warning,
            icon: Icons.delete_outline,
            onTap: () {
              showDialog(
                  context: context,
                  builder: (_) => DeleteTransactionDialog(
                        wrappingScaffoldKey: _scaffoldKey,
                        walletID: widget.user['WalletID'],
                        txID: tx['id'],
                      ));
            },
          ),
          // new IconSlideAction(
          //   caption: 'Share',
          //   color: Colors.indigo,
          //   icon: Icons.share,
          //   onTap: () {},
          // ),
        ],
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 10.0),
          child: Theme(
            data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
            child: ExpansionTile(
              tilePadding: EdgeInsets.all(10),
              backgroundColor: Colors.transparent,
              title: Row(children: [
                SizedBox(width: 50, height: 50, child: createCircleIcon(selectedIcon['Name'], selectedIcon['BackgroundColor'], selectedIcon['Color'])),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(
                    tx['categoryName'],
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      '${convertToDDMMYYYYHHMM(tx['time'])}',
                      style: TextStyle(color: Colors.black87, fontWeight: FontWeight.w200, fontSize: 14),
                    ),
                  )
                ]),
                Expanded(
                    child: Padding(
                        padding: const EdgeInsets.only(left: 8.0),
                        child: Align(
                            alignment: Alignment.centerRight,
                            child: Text(
                              '${moneyFormatter(tx['price'])}',
                              style: TextStyle(color: tx['price'] < 0 ? Colors.red : Colors.green, fontWeight: FontWeight.bold),
                            ))))
              ]),
              children: [
                Padding(
                    padding: const EdgeInsets.only(left: 20.0, right: 20, top: 10),
                    child: Row(
                      children: [
                        Expanded(child: Text(tx['description'] != null && tx['description'].length > 0 ? 'Mô tả: ${tx['description']}' : '')),
                        Padding(
                          padding: const EdgeInsets.only(left: 15.0),
                          child: TextButton(onPressed: () {}, child: Text('Xem chi tiết')),
                        )
                      ],
                    ))
              ],
            ),
          ),
        ),
      ),
    );
  }

  String toUnicode(String value) {
    print(value.codeUnits[0]);
    return '65456';
  }

  // color from database is hexadecimal : #123456; convert to int
  CircleAvatar createCircleIcon(String name, String background, String foreground) => CircleAvatar(
        backgroundColor: Color(int.parse('0x' + background.substring(2))),
        foregroundColor: Color(int.parse('0x' + foreground.substring(2))),
        child: FlutterLogo(size: 40.0
            // Icon(IconData(0xe88a, fontFamily: 'MaterialIcons'),
            //   color: Colors.pink,
            //   size: 40.0,
            //   semanticLabel: 'Text to announce in accessibility modes',
            ),
      );

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