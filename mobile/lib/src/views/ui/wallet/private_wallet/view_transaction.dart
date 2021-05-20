import 'package:flutter/material.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/edit_transaction.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class ViewTransaction extends StatefulWidget {
  final String walletID;
  final Map<String, dynamic> tx;
  final List<dynamic> eventList;
  final List<dynamic> fullCategoryList;

  const ViewTransaction({Key key, @required this.walletID, @required this.tx, @required this.eventList, @required this.fullCategoryList}) : super(key: key);

  @override
  _ViewTransactionState createState() => _ViewTransactionState();
}

class _ViewTransactionState extends State<ViewTransaction> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: _appBar(),
        body: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                decoration: BoxDecoration(
                  border: Border.all(width: 0, color: primary),
                  color: primary,
                  // gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [primary, const Color(0xFFb4dc63)])
                ),
                width: MediaQuery.of(context).size.width,
                height: 40,
              ),
              Container(
                decoration: BoxDecoration(
                    border: Border(
                      left: BorderSide(
                        color: primary,
                        width: 0.0,
                      ),
                      top: BorderSide(
                        color: primary,
                        width: 0.0,
                      ),
                      right: BorderSide(
                        color: primary,
                        width: 0.0,
                      ),
                      bottom: BorderSide(
                        color: Colors.white,
                        width: 0.0,
                      ),
                    ),
                    color: primary),
                width: MediaQuery.of(context).size.width,
                child: Container(
                  decoration: BoxDecoration(borderRadius: BorderRadius.only(topLeft: Radius.circular(20.0), topRight: Radius.circular(20.0)), color: Colors.white),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Transform.translate(
                          offset: Offset(0, -30),
                          child: Container(
                            padding: EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.all(Radius.circular(20)),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.grey.withOpacity(0.5),
                                  spreadRadius: 4,
                                  blurRadius: 5,
                                  offset: Offset(0, 2), // changes position of shadow
                                ),
                              ],
                            ),
                            child: FlutterLogo(
                              size: 50,
                            ),
                          )),
                      Text(
                        widget.tx['categoryName'],
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
                      )
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  '${formatMoneyWithSymbol(widget.tx['price'])}',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 45, color: widget.tx['price'] > 0 ? Colors.green : Colors.red),
                ),
              ),
              createDetail('Ngày giao dịch', widget.tx['time'], 'iconName'),
              createDetail('Ghi chú', widget.tx['description'].length == 0 ? 'Không có chú thích được tạo' : widget.tx['description'], 'iconName'),
              createDetail('Sự kiện', widget.tx['eventName'] == null ? 'Không có sự kiện được chọn' : widget.tx['eventName'], 'iconName')
            ],
          ),
        ),
      ),
    );
  }

  createDetail(String key, String value, String iconName) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Row(
        children: [
          FlutterLogo(size: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Text(key),
          ),
          Expanded(
              child: Text(
            value,
            textAlign: TextAlign.right,
          ))
        ],
      ),
    );
  }

  AppBar _appBar() => AppBar(
      shadowColor: Colors.transparent,
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Chi tiết giao dịch', style: TextStyle(color: Colors.white)),
      actions: [
        IconButton(
          icon: Icon(Icons.edit, size: 26),
          onPressed: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => EditTransaction(
                        walletID: widget.walletID, tx: widget.tx, fullCategoryList: widget.fullCategoryList, eventList: widget.eventList, wrappingScaffoldKey: _scaffoldKey)));
          },
        )
      ],
      backgroundColor: primary,
      centerTitle: true);
}
