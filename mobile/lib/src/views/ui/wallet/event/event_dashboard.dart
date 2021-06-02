import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/wallet/category/add_cat.dart';
import 'package:mobile/src/views/ui/wallet/event/add_event.dart';
import 'package:mobile/src/views/ui/wallet/event/delete_event.dart';
import 'package:mobile/src/views/ui/wallet/event/view_event.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class EventDashboard extends StatefulWidget {
  final String walletID;
  final List<dynamic> fullCatList;
  final Function(List<dynamic>, List<dynamic>, List<dynamic>) setCategoryList;
  final List<dynamic> eventList;
  final Function(List<dynamic>) setEventList;
  final List<dynamic> iconList;

  const EventDashboard(
      {Key key,
      @required this.walletID,
      @required this.fullCatList,
      @required this.setCategoryList,
      @required this.eventList,
      @required this.setEventList,
      @required this.iconList})
      : super(key: key);

  @override
  _EventDashboardState createState() => _EventDashboardState();
}

class _EventDashboardState extends State<EventDashboard> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  Socket _socket;
  List<dynamic> _typeList = [];

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print(widget.walletID);
    initPage();
  }

  initPage() async {
    _socket = await getSocket();
    _socket.emitWithAck('get_event_type', {}, ack: (data) {
      setState(() {
        _typeList = data['eventTypeList'];
      });
    });
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
        key: _scaffoldKey,
        child: Scaffold(
          appBar: mySimpleAppBar('Quản lý sự kiện'),
          body: SingleChildScrollView(
            child: Container(
              padding: EdgeInsets.fromLTRB(13, 30, 13, 50),
              width: MediaQuery.of(context).size.width,
              child: Column(
                children: [
                  Align(alignment: Alignment.centerLeft, child: Text('Sự kiện đang diễn ra', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25))),
                  for (dynamic item in widget.eventList.where((element) => element['Status'] == 1)) _createRunningEventList(item),
                  Padding(
                    padding: const EdgeInsets.only(top: 20.0),
                    child: Align(alignment: Alignment.centerLeft, child: Text('Sự kiện đã ngưng', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25))),
                  ),
                  for (dynamic item in widget.eventList.where((element) => element['Status'] == 0)) _createStoppedEventList(item),
                ],
              ),
            ),
          ),
          floatingActionButton: _catDashboardActionButton(),
        ));
  }

  _createRunningEventList(dynamic item) {
    print(item['ID']);
    return Card(
      margin: EdgeInsets.symmetric(vertical: 10),
      child: GestureDetector(
        onTap: () {
          Navigator.push(context, MaterialPageRoute(builder: (context) => ViewEvent(event: item, icon: widget.iconList.firstWhere((element) => element['ID'] == item['IconID']),)));
        },
        child: Slidable(
          actionPane: SlidableDrawerActionPane(),
          actionExtentRatio: 0.25,
          secondaryActions: <Widget>[
            IconSlideAction(
              caption: 'Kết thúc',
              color: warning,
              icon: Icons.stop,
              onTap: () async {
                await showDialog(
                    context: context,
                    builder: (_) => DeleteEventDialog(
                          wrappingScaffoldKey: _scaffoldKey,
                          walletID: widget.walletID,
                          eventID: item['ID'],
                        ));

                setState(() {});
              },
            ),
          ],
          child: DefaultTextStyle(
            style: TextStyle(fontSize: 15, color: Colors.white),
            child: Container(
              decoration: BoxDecoration(color: Color(0xff13315f), borderRadius: BorderRadius.circular(12)),
              padding: EdgeInsets.all(15),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Container(
                    padding: const EdgeInsets.only(top: 10),
                    child: Text(
                      item['Name'],
                      style: TextStyle(fontSize: 20),
                    )),
                Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          '${item['ExpectingAmount'] < 0 ? '' : '+'}${formatMoneyWithSymbol(item['ExpectingAmount'])}',
                          style: TextStyle(color: item['ExpectingAmount'] < 0 ? Colors.redAccent : Colors.lightGreenAccent, fontWeight: FontWeight.bold, fontSize: 35),
                        ))),
                Padding(
                  padding: const EdgeInsets.only(top: 20.0),
                  child: Row(
                    children: [
                      Expanded(
                          child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Giao dịch kế tiếp'),
                          Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text('${convertToDDMMYYYYHHMM(item['NextDate'])}', style: TextStyle(fontWeight: FontWeight.w300)),
                          )
                        ],
                      )),
                      Expanded(
                          child: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('Thời gian còn lại'),
                          Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text('${timeRemaining(item['NextDate'])}', style: TextStyle(fontWeight: FontWeight.w300)),
                          )
                        ],
                      ))
                    ],
                  ),
                ),
              ]),
            ),
          ),
        ),
      ),
    );
  }

  _createStoppedEventList(dynamic item) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 10),
      child: GestureDetector(
        onTap: () {
          for(String key in widget.iconList[0].keys) {
            print('${key}');
          }
          Navigator.push(context, MaterialPageRoute(builder: (context) => ViewEvent(event: item, icon: widget.iconList.firstWhere((element) => element['ID'] == item['IconID']),)));
        },
        child: DefaultTextStyle(
          style: TextStyle(fontSize: 15, color: Colors.white),
          child: Container(
            decoration: BoxDecoration(color: Color(0xff13315f), borderRadius: BorderRadius.circular(7)),
            padding: EdgeInsets.all(15),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Container(
                  padding: const EdgeInsets.only(top: 10),
                  child: Text(
                    item['Name'],
                    style: TextStyle(fontSize: 20),
                  )),
              Padding(
                  padding: const EdgeInsets.only(top: 20),
                  child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        '${item['ExpectingAmount'] < 0 ? '' : '+'}${formatMoneyWithSymbol(item['ExpectingAmount'])}',
                        style: TextStyle(color: item['ExpectingAmount'] < 0 ? Colors.redAccent : Colors.lightGreenAccent, fontWeight: FontWeight.bold, fontSize: 35),
                      ))),
              Padding(
                padding: const EdgeInsets.only(top: 20.0),
                child: Row(
                  children: [
                    Expanded(
                        child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Ngày bắt đầu'),
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text('${convertToDDMMYYYYHHMM(item['StartDate'])}', style: TextStyle(fontWeight: FontWeight.w300)),
                        )
                      ],
                    )),
                    Expanded(
                        child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('Ngày kết thúc'),
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text('${convertToDDMMYYYYHHMM(item['EndDate'])}', style: TextStyle(fontWeight: FontWeight.w300)),
                        )
                      ],
                    ))
                  ],
                ),
              ),
            ]),
          ),
        ),
      ),
    );
  }

  CircleAvatar createCircleIcon(String name, String background, String foreground) => CircleAvatar(
        // backgroundColor: Color(int.parse('0x' + background.substring(2))),
        // foregroundColor: Color(int.parse('0x' + foreground.substring(2))),
        child: FlutterLogo(size: 40.0
            //     Icon(MdiIcons.fromString('sword'),
            //       // color: Colors.pink,
            //       // size: 40.0,
            //       // semanticLabel: 'Text to announce in accessibility modes',
            ),
      );

  FloatingActionButton _catDashboardActionButton() => FloatingActionButton(
      onPressed: () async {
        await Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => AddEvent(walletID: widget.walletID, fullCategoryList: widget.fullCatList, eventTypeList: _typeList, wrappingScaffoldKey: _scaffoldKey, iconList: widget.iconList)));

        setState(() {});
      },
      tooltip: 'Thêm loại giao dịch mới',
      child: Icon(Icons.add),
      backgroundColor: secondary,
      foregroundColor: Colors.white);
}
