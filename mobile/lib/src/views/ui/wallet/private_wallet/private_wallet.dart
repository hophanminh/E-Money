import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/models/CatsProvider.dart';
import 'package:mobile/src/models/EventsProvider.dart';
import 'package:mobile/src/models/NotificationProvider.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/models/WalletsProvider.dart';
import 'package:mobile/src/services/icon_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/wallet/category/category_dashboard.dart';
import 'package:mobile/src/views/ui/wallet/event/event_dashboard.dart';
import 'package:mobile/src/views/ui/wallet/notification/notification_view.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/add_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/delete_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/edit_transaction.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/statistic/statistic_view.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/view_transaction.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class IndividualWallet extends StatefulWidget {
  final Drawer sidebar;

  const IndividualWallet({this.sidebar});

  @override
  _IndividualWalletState createState() => _IndividualWalletState();
}

class _IndividualWalletState extends State<IndividualWallet> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  IO.Socket _socket;
  List<IconCustom> _iconList = [];
  FilterType _selectedFilterType = FilterType.all;
  bool _isLoading = true;
  String walletID = "";
  void _initPage() async {
    _searchController.addListener(_onHandleChangeSearchBar);

    UsersProvider usersProvider = Provider.of<UsersProvider>(context, listen: false);
    WalletsProvider walletsProvider = Provider.of<WalletsProvider>(context, listen: false);
    CatsProvider catsProvider = Provider.of<CatsProvider>(context, listen: false);
    EventsProvider eventsProvider = Provider.of<EventsProvider>(context, listen: false);
    walletID = usersProvider.info.walletID;

    _iconList = await IconService.instance.iconList;
    _socket = await getSocket();

    _socket.emitWithAck('get_transaction', {'walletID': walletID}, ack: (data) {
      //{ transactionList, total, spend, receive }
      // print(data);
      walletsProvider.fetchData(data);
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });

    _socket.on('wait_for_update_transaction_$walletID', (data) {
      print('on updating txs');
      walletsProvider.fetchData(data);
    });

    _socket.emitWithAck("get_category", {'walletID': walletID}, ack: (data) {
      catsProvider.fetchData(data);
    });

    _socket.on('wait_for_update_category_$walletID', (data) {
      print('on updating cate');
      catsProvider.fetchData(data);
      walletsProvider.updateTxCatAfterUpdateCat(data['fullList']);
    });

    _socket.emitWithAck("get_event", {'walletID': walletID}, ack: (data) {
      eventsProvider.fetchData(data);
    });

    _socket.on('wait_for_update_event_$walletID', (data) {
      print('update event');
      eventsProvider.fetchData(data);
    });

    if (mounted) {
      setState(() {});
    }
  }

  @override
  void initState() {
    super.initState();
    _initPage();
  }

  @override
  void dispose() {
    // print('wait_for_update_transaction_$walletID');
    _socket.off('wait_for_update_transaction_$walletID');
    _socket.off('wait_for_update_category_$walletID');
    _socket.off('wait_for_update_event_$walletID');
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {
          FocusManager.instance.primaryFocus.unfocus();
        },
        child: ScaffoldMessenger(
          key: _scaffoldKey,
          child: Scaffold(
            appBar: _privateWalletAppBar(),
            drawer: widget.sidebar,
            floatingActionButton: _privateWalletActionButton(),
            body: _isLoading
                ? Center(child: CircularProgressIndicator())
                : Container(
                    // height: MediaQuery.of(context).size.height,
                    child: Center(child: Consumer<WalletsProvider>(builder: (context, walletsProvider, child) {
                      return SingleChildScrollView(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: <Widget>[
                            Column(
                              children: [
                                Container(
                                  padding: EdgeInsets.all(20),
                                  margin: EdgeInsets.only(bottom: 20, left: 5, right: 5, top: 20),
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
                                        '${formatMoneyWithSymbol(walletsProvider.total)}',
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
                                        decoration: BoxDecoration(border: Border(right: BorderSide(width: 1, color: Colors.black12))),
                                        alignment: Alignment.center,
                                        child: Column(
                                          children: [
                                            Text('Tổng thu ${getThisMonth()}'),
                                            Padding(
                                              padding: const EdgeInsets.all(8.0),
                                              child: Text(
                                                '${formatMoneyWithSymbol(walletsProvider.receive)}',
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
                                                    '${formatMoneyWithSymbol(walletsProvider.spent)}',
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
                                DefaultTextStyle(
                                  style: TextStyle(color: Colors.grey, fontSize: 16),
                                  child: Container(
                                    height: 70,
                                    margin: EdgeInsets.fromLTRB(10, 10, 0, 10),
                                    child: ListView(
                                      scrollDirection: Axis.horizontal,
                                      children: <Widget>[
                                        _createFilterOption('Tất cả', (Icons.format_list_bulleted_outlined), FilterType.all),
                                        _createFilterOption('Hạng mục', (Icons.category_outlined), FilterType.category),
                                        _createFilterOption('Thời gian', (Icons.calendar_today), FilterType.date),
                                      ],
                                    ),
                                  ),
                                ),
                                _selectedFilterType == FilterType.category
                                    ? mySearchBar(context, _searchController, 'Tìm kiếm tên hạng mục...')
                                    : (_selectedFilterType == FilterType.date ? _makeDropdown() : Container()),
                                walletsProvider.txList.length == 0 ? Text('(Chưa có giao dịch được ghi)') : Container(),
                              ],
                            ),
                            ConstrainedBox(
                                constraints: new BoxConstraints(
                                  minHeight: 250.0,
                                  minWidth: 250.0,
                                ),
                                child: ListView.builder(
                                  scrollDirection: Axis.vertical,
                                  physics: NeverScrollableScrollPhysics(),
                                  shrinkWrap: true,
                                  itemCount: walletsProvider.getFilterList(_selectedFilterType).length,
                                  itemBuilder: (BuildContext context, int index) {
                                    List<Transactions> list = walletsProvider.getFilterList(_selectedFilterType);
                                    if (index == list.length - 1) {
                                      return Padding(padding: const EdgeInsets.only(bottom: 60), child: _createCompactTxn(list[index]));
                                    }
                                    return _createCompactTxn(list[index]);
                                  },
                                )),
                          ],
                        ),
                      );
                    })),
                  ),
          ),
        ));
  }

  void _handleChangeFilterType(FilterType type) {
    Provider.of<WalletsProvider>(context, listen: false).changeSearchString(_searchController.text = '');
    Provider.of<WalletsProvider>(context, listen: false).changeSearchMonth('');
    Provider.of<WalletsProvider>(context, listen: false).changeSearchYear('');

    setState(() {
      _selectedFilterType = type;
    });
  }

  void _onHandleChangeSearchBar() {
    Provider.of<WalletsProvider>(context, listen: false).changeSearchString(_searchController.text.trim());
  }

  _createFilterOption(String label, IconData icon, FilterType type) {
    if (type != _selectedFilterType) {
      return GestureDetector(
        onTap: () {
          _handleChangeFilterType(type);
        },
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
          margin: EdgeInsets.only(right: 15),
          child: Row(
            children: <Widget>[
              Icon(icon, size: 25, color: Colors.grey),
              Padding(
                padding: EdgeInsets.only(left: 10.0),
                child: Text(label),
              ),
            ],
          ),
        ),
      );
    } else {
      return Container(
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
        margin: EdgeInsets.only(right: 15),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(15),
          color: primary.withOpacity(0.1),
        ),
        child: Row(
          children: <Widget>[
            Icon(icon, size: 25, color: primary),
            Padding(
              padding: EdgeInsets.only(left: 10.0),
              child: Text(
                label,
                style: TextStyle(color: primary, fontWeight: FontWeight.w500),
              ),
            ),
          ],
        ),
      );
    }
  }

  _createCompactTxn(Transactions tx) {
    IconCustom selectedIcon = _iconList.firstWhere((element) => element.id == tx.iconID, orElse: () => new IconCustom(id: '', name: '', color: '', backgroundColor: ''));
    return Card(
      child: GestureDetector(
        onTap: () {
          Provider.of<WalletsProvider>(context, listen: false).changeSelected(tx);
          Navigator.push(context, MaterialPageRoute(builder: (context) => ViewTransaction(txId: tx.id)));
        },
        child: Slidable(
          actionPane: SlidableDrawerActionPane(),
          actionExtentRatio: 0.25,
          secondaryActions: <Widget>[
            IconSlideAction(
                caption: 'Sửa',
                color: Colors.blue,
                icon: Icons.edit,
                onTap: () async {
                  Provider.of<WalletsProvider>(context, listen: false).changeSelected(tx);
                  Navigator.push(context, MaterialPageRoute(builder: (context) => EditTransaction(wrappingScaffoldKey: _scaffoldKey)));
                }),
            IconSlideAction(
              caption: 'Xóa',
              color: warning,
              icon: Icons.delete_outline,
              onTap: () {
                showDialog(
                    context: context,
                    builder: (_) => DeleteTransactionDialog(
                          wrappingScaffoldKey: _scaffoldKey,
                          txID: tx.id,
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
                      Container(
                          margin: EdgeInsets.only(left: 6, right: 15),
                          width: 50,
                          height: 50,
                          child: myCircleIcon(selectedIcon.name, selectedIcon.backgroundColor, selectedIcon.color)),
                      Expanded(
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(
                            '${tx.categoryName}',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(
                              '${convertToDDMMYYYYHHMM(tx.time)}',
                              style: TextStyle(color: Colors.black, fontWeight: FontWeight.w400, fontSize: 16),
                            ),
                          ),
                          Padding(
                              padding: const EdgeInsets.only(top: 10),
                              child: tx.description != null && tx.description.length > 0
                                  ? Text(
                                      tx.description.length < 50 ? tx.description : tx.description.toString().substring(0, 50) + ' ...',
                                      style: TextStyle(fontWeight: FontWeight.w300),
                                    )
                                  : Container())
                        ]),
                      ),
                      Padding(
                          padding: const EdgeInsets.only(left: 10),
                          child: Align(
                              alignment: Alignment.centerRight,
                              child: Text(
                                '${formatMoneyWithSymbol(tx.price)}',
                                style: TextStyle(color: tx.price < 0 ? Colors.red : Colors.green, fontWeight: FontWeight.bold),
                              )))
                    ]),
                    tx.editNumber > 1
                        ? Padding(
                            padding: const EdgeInsets.only(top: 10.0),
                            child: Align(
                              alignment: Alignment.centerRight,
                              child: Text(
                                '(Có chỉnh sửa)',
                                style: TextStyle(fontStyle: FontStyle.italic, fontWeight: FontWeight.w300),
                              ),
                            ),
                          )
                        : Container()
                  ],
                ),
              )),
        ),
      ),
    );
  }

  _createAppbaPopupMenuItemDetail(String value, Icon icon) {
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
        //   icon: Stack(
        //     fit: StackFit.expand,
        //     children: [
        //       Icon(Icons.notifications_none_outlined, size: 26),
        //       Positioned(
        //           // draw a red marble
        //           top: 0.0,
        //           right: -2.0,
        //           child: Consumer<NotificationProvider>(builder: (context, notificationProvider, child) {
        //             return notificationProvider.count != 0
        //                 ? Container(
        //                     padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
        //                     decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.red),
        //                     alignment: Alignment.center,
        //                     child: Text(
        //                       '${notificationProvider.count}',
        //                       style: TextStyle(fontSize: 12, color: Colors.white),
        //                     ),
        //                   )
        //                 : Container();
        //           }))
        //     ],
        //   ),
        //   onPressed: () {
        //     Navigator.push(context, MaterialPageRoute(builder: (context) => NotificationsPage()));
        //   },
        // ),
        PopupMenuButton(
          itemBuilder: (BuildContext bc) => [
            PopupMenuItem(child: _createAppbaPopupMenuItemDetail("Hạng mục thu - chi", Icon(Icons.category_outlined, color: Colors.black)), value: "1"),
            PopupMenuItem(child: _createAppbaPopupMenuItemDetail("Sự kiện", Icon(Icons.event, color: Colors.black)), value: "2"),
            PopupMenuItem(child: _createAppbaPopupMenuItemDetail("Thống kê ví", Icon(Icons.bar_chart_outlined, color: Colors.black)), value: "3"),
          ],
          onSelected: (route) {
            print(route);
            // Note You must create respective pages for navigation
            String walletId = Provider.of<UsersProvider>(context, listen: false).info.walletID;

            switch (int.parse(route)) {
              case 1:
                Navigator.push(context, MaterialPageRoute(builder: (context) => CategoryDashboard(walletID: walletId)));
                break;
              case 2:
                Navigator.push(context, MaterialPageRoute(builder: (context) => EventDashboard(walletID: walletId)));
                break;
              case 3:
                Navigator.push(context, MaterialPageRoute(builder: (context) => Statistic()));
                break;
            }
          },
        ),
      ],
      backgroundColor: primary,
      centerTitle: true);

  FloatingActionButton _privateWalletActionButton() => FloatingActionButton(
      onPressed: () {
        Navigator.push(context, MaterialPageRoute(builder: (context) => AddTransaction(wrappingScaffoldKey: _scaffoldKey)));
      },
      tooltip: 'Thêm giao dịch',
      child: Icon(Icons.add),
      backgroundColor: secondary,
      foregroundColor: Colors.white);

  var _searchController = new TextEditingController();
  String currentYear;
  String currentMonth;

  _makeDropdown() {
    List<DropdownMenuItem<String>> years = [];
    List<DropdownMenuItem<String>> months = [];
    for (int i = 2021; i < 2050; i++) {
      years.add(new DropdownMenuItem(
        child: Text('$i'),
        value: '$i',
      ));
    }

    // init year to search but month
    // currentYear = years[0].value;
    // Provider.of<WalletsProvider>(context, listen: false).changeSearchYear(years[0].value);

    for (int i = 1; i <= 12; i++) {
      months.add(new DropdownMenuItem(
        child: Text('$i'),
        value: '$i',
      ));
    }
    // currentMonth = months[0].value;
    // currentYear = years[0].value;

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      child: Row(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(right: 10.0),
              child: DropdownButtonFormField(
                  onChanged: (value) {
                    Provider.of<WalletsProvider>(context, listen: false).changeSearchYear(value);
                    setState(() {
                      currentYear = value;
                    });
                  },
                  decoration: myInputDecoration('', label: 'Năm', inputBorder: Colors.black26),
                  items: years,
                  value: currentYear),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(left: 10.0),
              child: DropdownButtonFormField(
                  onChanged: (value) {
                    Provider.of<WalletsProvider>(context, listen: false).changeSearchMonth(value);
                    setState(() {
                      currentMonth = value;
                    });
                  },
                  decoration: myInputDecoration('', label: 'Tháng', inputBorder: Colors.black26),
                  items: months,
                  value: currentMonth),
            ),
          )
        ],
      ),
    );
  }
}
