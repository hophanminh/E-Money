import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/add_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/delete_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/edit_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/view_transaction.dart';
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
  var _txs = [];
  var _stat = new Map<String, dynamic>();
  var _categoryList = {'fullList': [], 'defaultList': [], 'customList': []};
  var _iconList = [];
  var _eventList = [];

  void _setCategoryList(List<dynamic> fullList, List<dynamic> defaultList, List<dynamic> customList) {
    setState(() {
      _categoryList['fullList'] = fullList;
      _categoryList['defaultList'] = defaultList;
      _categoryList['customList'] = customList;
    });
  }

  void _setEventList(List<dynamic> eventList) {
    setState(() {
      _eventList = eventList;
    });
  }

  void _initPage() async {
    final walletID = widget.user['WalletID'];
    _iconList = jsonDecode(await WalletService.instance.getListIcon());
    // print('${iconList[0]['ID']}');

    _socket = await getSocket();

    _socket.emitWithAck('get_transaction', {'walletID': walletID}, ack: (data) {
      //{ transactionList, total, spend, receive }
      // print(data['transactionList'][0]['id']);
      setState(() {
        _txs = data['transactionList'];
        _stat = {"total": data['total'], "spend": data['spend'], "receive": data['receive']};
      });
    });

    _socket.on('wait_for_update_transaction', (data) {
      print('on updating txs');
      setState(() {
        _txs = data['transactionList'];
        _stat = {"total": data['total'], "spend": data['spend'], "receive": data['receive']};
      });
    });

    _socket.emitWithAck("get_category", {'walletID': walletID}, ack: (data) => {_setCategoryList(data['fullList'], data['defaultList'], data['customList'])});

    _socket.on('wait_for_update_category', (data) => {_setCategoryList(data['fullList'], data['defaultList'], data['customList'])});

    _socket.emitWithAck("get_event", {'walletID': walletID}, ack: (data) {
      _setEventList(data['eventList']);
    });

    _socket.on('wait_for_update_event', (data) => {_setEventList(data['eventList'])});
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
          appBar: _privateWalletAppBar(),
          drawer: widget.sidebar,
          floatingActionButton: _privateWalletActionButton(),
          body: SingleChildScrollView(
            child: Container(
              // height: MediaQuery.of(context).size.height,
              padding: EdgeInsets.only(top: 20, bottom: 100),
              child: Center(
                child: Column(
                  children: [
                    Container(
                      padding: EdgeInsets.all(20),
                      margin: EdgeInsets.only(bottom: 20, left: 5, right: 5),
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
                            '${formatMoneyWithSymbol(_stat['total'])}',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(15),
                      child: Text('Báo cáo nhanh ${getThisMonth()}', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                    ),
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(border: Border(right: BorderSide(width: 1, color: Colors.grey))),
                            alignment: Alignment.center,
                            child: Column(
                              children: [
                                Text('Tổng thu ${getThisMonth()}'),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Text(
                                    '${formatMoneyWithSymbol(_stat['receive'])}',
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
                                    Text('Tổng chi ${getThisMonth()}'),
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Text(
                                        '${formatMoneyWithSymbol(_stat['spend'])}',
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
                      child: Text('Danh sách tất cả giao dịch', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                    ),
                    for (var tx in _txs) _createCompactTxn(tx)
                  ],
                ),
              ),
            ),
          )),
    );
  }

  _createCompactTxn(Map<String, dynamic> tx) {
    var selectedIcon = _iconList.firstWhere((element) => element['ID'] == tx['IconID']);
    return Card(
      child: GestureDetector(
        onTap: () {
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => ViewTransaction(walletID: widget.user['WalletID'], tx: tx, fullCategoryList: _categoryList['fullList'], eventList: _eventList)));
        },
        child: Slidable(
          actionPane: SlidableDrawerActionPane(),
          actionExtentRatio: 0.25,
          secondaryActions: <Widget>[
            IconSlideAction(
              caption: 'Sửa',
              color: Colors.blue,
              icon: Icons.edit,
              onTap: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => EditTransaction(
                            walletID: widget.user['WalletID'], tx: tx, fullCategoryList: _categoryList['fullList'], eventList: _eventList, wrappingScaffoldKey: _scaffoldKey)));
              },
            ),
            IconSlideAction(
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
          ],
          child: Container(
              margin: const EdgeInsets.symmetric(vertical: 10.0),
              child: Container(
                padding: EdgeInsets.fromLTRB(10, 15, 10, 5),
                child: Column(
                  children: [
                    Row(children: [
                      SizedBox(width: 50, height: 50, child: createCircleIcon(selectedIcon['Name'], selectedIcon['BackgroundColor'], selectedIcon['Color'])),
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(
                          '${tx['categoryName']}',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text(
                            '${convertToDDMMYYYYHHMM(tx['time'])}',
                            style: TextStyle(color: Colors.black, fontWeight: FontWeight.w300, fontSize: 14),
                          ),
                        )
                      ]),
                      Expanded(
                          child: Padding(
                              padding: const EdgeInsets.only(left: 10.0, right: 8),
                              child: Align(
                                  alignment: Alignment.centerRight,
                                  child: Text(
                                    '${formatMoneyWithSymbol(tx['price'])}',
                                    style: TextStyle(color: tx['price'] < 0 ? Colors.red : Colors.green, fontWeight: FontWeight.bold),
                                  ))))
                    ]),
                    Padding(
                        padding: const EdgeInsets.only(top: 10, left: 10),
                        child: Row(
                          children: [
                            Expanded(
                                child: Text(tx['description'] != null && tx['description'].length > 0
                                    ? 'Mô tả: ${tx['description'].length < 50 ? tx['description'] : tx['description'].toString().substring(0, 50) + ' ...'}'
                                    : 'Mô tả:')),
                          ],
                        )),
                  ],
                ),
              )),
        ),
      ),
    );
  }

  _createCompactTxn1(Map<String, dynamic> tx) {
    var selectedIcon = _iconList.firstWhere((element) => element['ID'] == tx['IconID']);
    return Card(
      child: Slidable(
        actionPane: SlidableDrawerActionPane(),
        actionExtentRatio: 0.25,
        secondaryActions: <Widget>[
          IconSlideAction(
            caption: 'Sửa',
            color: Colors.blue,
            icon: Icons.edit,
            onTap: () {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => EditTransaction(
                          walletID: widget.user['WalletID'], tx: tx, fullCategoryList: _categoryList['fullList'], eventList: _eventList, wrappingScaffoldKey: _scaffoldKey)));
            },
          ),
          IconSlideAction(
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
                    '${tx['categoryName']}',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  // tx['eventName'] != null
                  //     ? Padding(
                  //       padding: const EdgeInsets.only(top: 8.0),
                  //       child: Text(
                  //           'Sự kiện: ${tx['eventName']}',
                  //           style: TextStyle(fontWeight: FontWeight.w300, fontSize: 14),
                  //         ),
                  //     )
                  //     : Container(),
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      '${convertToDDMMYYYYHHMM(tx['time'])}',
                      style: TextStyle(color: Colors.black, fontWeight: FontWeight.w300, fontSize: 14),
                    ),
                  )
                ]),
                Expanded(
                    child: Padding(
                        padding: const EdgeInsets.only(left: 8.0),
                        child: Align(
                            alignment: Alignment.centerRight,
                            child: Text(
                              '${formatMoneyWithSymbol(tx['price'])}',
                              style: TextStyle(color: tx['price'] < 0 ? Colors.red : Colors.green, fontWeight: FontWeight.bold),
                            ))))
              ]),
              children: [
                Padding(
                    padding: const EdgeInsets.only(left: 20.0, right: 20, top: 10),
                    child: Row(
                      children: [
                        Expanded(
                            child: Text(tx['description'] != null && tx['description'].length > 0
                                ? 'Mô tả: ${tx['description'].length < 50 ? tx['description'] : tx['description'].toString().substring(0, 50) + ' ...'}'
                                : '')),
                        Padding(
                          padding: const EdgeInsets.only(left: 15.0),
                          child: TextButton(
                              onPressed: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) =>
                                            ViewTransaction(walletID: widget.user['WalletID'], tx: tx, fullCategoryList: _categoryList['fullList'], eventList: _eventList)));
                              },
                              child: Text('Xem chi tiết')),
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

  // color from database is hexadecimal : #123456; convert to int
  CircleAvatar createCircleIcon(String name, String background, String foreground) => CircleAvatar(
        backgroundColor: Color(int.parse('0x' + background.substring(2))),
        foregroundColor: Color(int.parse('0x' + foreground.substring(2))),
        child: FlutterLogo(size: 40.0
            //     Icon(MdiIcons.fromString('sword'),
            //       // color: Colors.pink,
            //       // size: 40.0,
            //       // semanticLabel: 'Text to announce in accessibility modes',
            ),
      );

  AppBar _privateWalletAppBar() => AppBar(
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

  FloatingActionButton _privateWalletActionButton() => FloatingActionButton(
      onPressed: () {
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    AddTransaction(walletID: widget.user['WalletID'], fullCategoryList: _categoryList['fullList'], eventList: _eventList, wrappingScaffoldKey: _scaffoldKey)));
      },
      tooltip: 'Thêm giao dịch',
      child: Icon(Icons.add),
      backgroundColor: secondary,
      foregroundColor: Colors.white);
}
