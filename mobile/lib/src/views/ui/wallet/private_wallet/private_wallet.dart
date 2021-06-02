import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/wallet/category/category_dashboard.dart';
import 'package:mobile/src/views/ui/wallet/event/event_dashboard.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/add_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/delete_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/edit_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/statistic/statistic_view.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/view_transaction.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
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
  List<dynamic> _iconList = [];
  List<dynamic> _eventList = [];

  void _setCategoryList(List<dynamic> fullList, List<dynamic> defaultList, List<dynamic> customList) {
    _categoryList['fullList'].clear();
    _categoryList['defaultList'].clear();
    _categoryList['customList'].clear();

    setState(() {
      _categoryList['fullList'].addAll(fullList);

      _categoryList['defaultList'].addAll(defaultList);

      _categoryList['customList'].addAll(customList);
    });
  }

  void _setEventList(List<dynamic> eventList) {
    _eventList.clear();
    setState(() {
      _eventList.addAll(eventList);
    });
  }

  void updateTxCatAfterUpdateCat(List<dynamic> fullList) {
    List<dynamic> copyTxs = List.from(_txs);

    for (int i = 0; i < copyTxs.length; i++) {
      dynamic cat = fullList.where((cat) => cat['ID'] == copyTxs[i]['catID']).first;
      if (cat != null) {
        copyTxs[i]['IconID'] = cat['IconID'];
        copyTxs[i]['categoryName'] = cat['Name'];
      }
    }
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
      _txs.clear();
      setState(() {
        _txs.addAll(data['transactionList']);
        _stat = {"total": data['total'], "spend": data['spend'], "receive": data['receive']};
      });
    });

    _socket.emitWithAck("get_category", {'walletID': walletID}, ack: (data) => {_setCategoryList(data['fullList'], data['defaultList'], data['customList'])});

    _socket.on('wait_for_update_category', (data) {
      print('update cate');
      _setCategoryList(data['fullList'], data['defaultList'], data['customList']);
      updateTxCatAfterUpdateCat(_categoryList['fullList']);
    });

    _socket.emitWithAck("get_event", {'walletID': walletID}, ack: (data) {
      _setEventList(data['eventList']);
    });

    _socket.on('wait_for_update_event', (data) {
      print('update event');
      _setEventList(data['eventList']);
    });
  }

  @override
  void initState() {
    super.initState();
    _initPage();
  }

  @override
  void dispose() {
    // _socket.off('wait_for_update_transaction');
    // _socket.off('wait_for_update_category');
    // _socket.off('wait_for_update_event');

    super.dispose();
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
                      padding: const EdgeInsets.only(top: 40, bottom: 30),
                      child: Text('Danh sách tất cả giao dịch', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                    ),
                    _txs.length == 0 ? Text('(Chưa có giao dịch được ghi)') : Container(),
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
                  builder: (context) => ViewTransaction(
                        walletID: widget.user['WalletID'],
                        tx: tx,
                        fullCategoryList: _categoryList['fullList'],
                        eventList: _eventList,
                        icon: selectedIcon,
                      )));
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
                              walletID: widget.user['WalletID'],
                              tx: tx,
                              fullCategoryList: _categoryList['fullList'],
                              eventList: _eventList,
                              wrappingScaffoldKey: _scaffoldKey,
                              iconList: _iconList,
                            )));
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
                child: Row(children: [
                  Container(
                      margin: EdgeInsets.all(6), width: 50, height: 50, child: createCircleIcon(selectedIcon['Name'], selectedIcon['BackgroundColor'], selectedIcon['Color'])),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
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
                      ),
                      Padding(
                          padding: const EdgeInsets.only(top: 10),
                          child: tx['description'] != null && tx['description'].length > 0
                              ? Text(tx['description'].length < 50 ? tx['description'] : tx['description'].toString().substring(0, 50) + ' ...')
                              : Container())
                    ]),
                  ),
                  Padding(
                      padding: const EdgeInsets.only(top: 10, left: 10),
                      child: Align(
                          alignment: Alignment.centerRight,
                          child: Text(
                            '${formatMoneyWithSymbol(tx['price'])}',
                            style: TextStyle(color: tx['price'] < 0 ? Colors.red : Colors.green, fontWeight: FontWeight.bold),
                          )))
                ]),
              )),
        ),
      ),
    );
  }

  _createDetail(String value, Icon icon) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        icon,
        Expanded(
          child: SizedBox(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10.0),
              child: Text(
                value,
                style: TextStyle(fontSize: 15, color: Colors.black54),
              ),
            ),
          ),
        ),
      ],
    );
  }

  AppBar _privateWalletAppBar() => AppBar(
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Ví cá nhân', style: TextStyle(color: Colors.white)),
      actions: [
        // IconButton(
        //   icon: Icon(Icons.arrow_drop_down_sharp, size: 30),
        //   onPressed: () {},
        // )
        PopupMenuButton(
          itemBuilder: (BuildContext bc) => [
            PopupMenuItem(child: _createDetail("Hạng mục thu - chi", Icon(Icons.category_outlined, color: Colors.black)), value: "1"),
            PopupMenuItem(child: _createDetail("Sự kiện", Icon(Icons.event, color: Colors.black)), value: "2"),
            PopupMenuItem(child: _createDetail("Thống kê ví", Icon(Icons.bar_chart_outlined, color: Colors.black)), value: "3"),
          ],
          onSelected: (route) {
            print(route);
            // Note You must create respective pages for navigation

            switch (int.parse(route)) {
              case 1:
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => CategoryDashboard(
                              walletID: widget.user['WalletID'],
                              txs: _txs,
                              defaultList: _categoryList['defaultList'],
                              customList: _categoryList['customList'],
                              setCategoryList: _setCategoryList,
                              iconList: _iconList,
                            )));
                break;
              case 2:
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => EventDashboard(
                              walletID: widget.user['WalletID'],
                              fullCatList: _categoryList['fullList'],
                              setCategoryList: _setCategoryList,
                              eventList: _eventList,
                              setEventList: _setEventList,
                              iconList: _iconList,
                            )));
                break;
              case 3:
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => Statistic(
                            // walletID: widget.user['WalletID'],
                            // fullCatList: _categoryList['fullList'],
                            // setCategoryList: _setCategoryList,
                            // eventList: _eventList,
                            // setEventList: _setEventList
                            )));
                break;
            }
          },
        ),
      ],
      backgroundColor: primary,
      centerTitle: true);

  FloatingActionButton _privateWalletActionButton() => FloatingActionButton(
      onPressed: () {
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => AddTransaction(
                    walletID: widget.user['WalletID'],
                    fullCategoryList: _categoryList['fullList'],
                    eventList: _eventList,
                    iconList: _iconList,
                    wrappingScaffoldKey: _scaffoldKey)));
      },
      tooltip: 'Thêm giao dịch',
      child: Icon(Icons.add),
      backgroundColor: secondary,
      foregroundColor: Colors.white);
}
