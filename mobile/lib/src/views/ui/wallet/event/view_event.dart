import 'package:flutter/material.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:outline_material_icons/outline_material_icons.dart';

class ViewEvent extends StatefulWidget {
  final Map<String, dynamic> event;
  final Map<String, dynamic> icon;

  const ViewEvent({Key key, @required this.event, @required this.icon}) : super(key: key);

  @override
  _ViewEventState createState() => _ViewEventState();
}

class _ViewEventState extends State<ViewEvent> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    super.initState();
    _initPage();
    for (String key in widget.event.keys) {
      print('${key}-${widget.event[key]}');
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  _initPage() async {}

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: _appBar(),
        body: SingleChildScrollView(
          padding: EdgeInsets.only(bottom: 10),
          child: Column(
            children: [
              Container(
                  decoration: BoxDecoration(
                    border: Border.all(width: 0, color: primary),
                    color: primary,
                  ),
                  width: MediaQuery.of(context).size.width,
                  height: 60),
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
                          offset: Offset(0, -45),
                          child: Container(
                            padding: EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.white, width: 5),
                              color: Color(int.parse('0xff' + widget.icon['BackgroundColor'].substring(1))),
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
                            child: Icon(
                              IconData(int.parse('${OMIcons.codePoints[widget.icon['Name']]}'), fontFamily: 'outline_material_icons', fontPackage: 'outline_material_icons'),
                              size: 90,
                              color: Colors.white,
                            ),
                          )),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text(
                            widget.event['Name'],
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 27),
                            textAlign: TextAlign.right,
                          ),
                          Text(
                            ' (${widget.event['Status'] == 1 ? 'Đang diễn ra' : 'Đã ngưng'})',
                            style: TextStyle(fontWeight: FontWeight.w300, fontSize: 18, fontStyle: FontStyle.italic),
                          )
                        ],
                      )
                    ],
                  ),
                ),
              ),
              _createDetail('Hạng mục', widget.event['CategoryName'], Icon(Icons.category_outlined)),
              _createDetail(
                  '${widget.event['ExpectingAmount'] < 0 ? 'Chi' : 'Thu'} định kỳ', formatMoneyWithSymbol(widget.event['ExpectingAmount']), Icon(Icons.attach_money_outlined)),
              _createDetail('${widget.event['ExpectingAmount'] < 0 ? 'Tổng chi' : 'Tổng thu'} cho sự kiện',
                  formatMoneyWithSymbol(widget.event['TotalAmount'] != null ? widget.event['TotalAmount'] : 0), Icon(Icons.attach_money_outlined)),
              _createDetail('Ngày bắt đầu', convertToDDMMYYYYHHMM(widget.event['StartDate']), Icon(Icons.looks_one_outlined)),
              _createDetail('Ngày kết thúc', convertToDDMMYYYYHHMM(widget.event['EndDate']).length == 0 ? '--' : convertToDDMMYYYYHHMM(widget.event['EndDate']),
                  Icon(Icons.looks_two_outlined)),
              widget.event['Status'] == 1 ? _createDetail('Ngày giao dịch kế tiếp', convertToDDMMYYYYHHMM(widget.event['NextDate']), Icon(Icons.next_plan_outlined)) : Container(),
              _createDetail('Loại', (() {
                int type = int.parse(widget.event['EventTypeID']);

                if (type == 1) {
                  // hằng ngày
                  return widget.event['TypeName'];
                }
                if (type == 2) {
                  // hằng tuần
                  return widget.event['TypeName'] + ' (vào ${everyWeek[widget.event['Value']]})';
                }
                if (type == 3) {
                  // hằng tháng
                  return widget.event['TypeName'] + ' (vào ngày ${widget.event['Value']})';
                }
                if (type == 4) {
                  // hằng năm
                  return widget.event['TypeName'] + ' (vào tháng ${widget.event['Value'] + 1})';
                }
              })(), Icon(Icons.event_available)),
              _createDetail('Ghi chú', widget.event['Description'].length == 0 ? 'Không có chú thích được tạo' : widget.event['Description'], Icon(Icons.textsms_outlined)),
            ],
          ),
        ),
      ),
    );
  }

  _createDetail(String key, String value, Icon icon) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          icon,
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Text(
              key,
              style: TextStyle(fontSize: 15, color: Colors.black54),
            ),
          ),
          Expanded(child: Text(value, textAlign: TextAlign.right, style: TextStyle(fontSize: 15)))
        ],
      ),
    );
  }

  AppBar _appBar() => AppBar(
      shadowColor: Colors.transparent,
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Thông tin sự kiện', style: TextStyle(color: Colors.white)),
      backgroundColor: primary,
      centerTitle: true);
}
