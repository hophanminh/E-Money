import 'package:flutter/material.dart';
import 'package:mobile/src/models/EventsProvider.dart';
import 'package:mobile/src/services/icon_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:outline_material_icons/outline_material_icons.dart';
import 'package:provider/provider.dart';

class ViewEvent extends StatefulWidget {
  const ViewEvent({Key key}) : super(key: key);

  @override
  _ViewEventState createState() => _ViewEventState();
}

class _ViewEventState extends State<ViewEvent> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  List<IconCustom> _iconList = [];

  @override
  void initState() {
    super.initState();
    _initPage();
  }

  @override
  void dispose() {
    super.dispose();
  }

  _initPage() async {
    _iconList = await IconService.instance.iconList;
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: _appBar(),
        body: SingleChildScrollView(
            padding: EdgeInsets.only(bottom: 10),
            child: Consumer<EventsProvider>(builder: (context, eventsProvider, child) {
              String tempId = eventsProvider.selected != null ? eventsProvider.selected.iconID : '';
              IconCustom selectedIcon = _iconList.firstWhere((element) => element.id == tempId, orElse: () => new IconCustom(id: '', name: '', color: '', backgroundColor: ''));

              return eventsProvider.selected != null
                  ? Column(
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
                                        color: Color(int.parse('0xFF' + (selectedIcon.backgroundColor == '' ? '#FFFFFF' : selectedIcon.backgroundColor).substring(1))),
                                        borderRadius: BorderRadius.all(Radius.circular(20)),
                                        border: Border.all(color: Colors.white, width: 5),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.grey.withOpacity(0.5),
                                            spreadRadius: 4,
                                            blurRadius: 5,
                                            offset: Offset(0, 2), // changes position of shadow
                                          ),
                                        ],
                                      ),
                                      child: selectedIcon.name == ''
                                          ? Container()
                                          : Icon(
                                              IconData(int.parse('${OMIcons.codePoints[selectedIcon.name]}'),
                                                  fontFamily: 'outline_material_icons', fontPackage: 'outline_material_icons'),
                                              size: 90,
                                              color: Colors.white,
                                            ),
                                    )),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Text(
                                      eventsProvider.selected.name,
                                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 27),
                                      textAlign: TextAlign.right,
                                    ),
                                    Text(
                                      ' (${eventsProvider.selected.status ? 'Đang diễn ra' : 'Đã ngưng'})',
                                      style: TextStyle(fontWeight: FontWeight.w300, fontSize: 18, fontStyle: FontStyle.italic),
                                    )
                                  ],
                                )
                              ],
                            ),
                          ),
                        ),
                        _createDetail('Hạng mục', eventsProvider.selected.categoryName, Icon(Icons.category_outlined)),
                        _createDetail('${eventsProvider.selected.expectingAmount < 0 ? 'Chi' : 'Thu'} định kỳ', formatMoneyWithSymbol(eventsProvider.selected.expectingAmount),
                            Icon(Icons.attach_money_outlined)),
                        _createDetail('${eventsProvider.selected.expectingAmount < 0 ? 'Tổng chi' : 'Tổng thu'} cho sự kiện',
                            formatMoneyWithSymbol(eventsProvider.selected.totalAmount != null ? eventsProvider.selected.totalAmount : 0), Icon(Icons.attach_money_outlined)),
                        _createDetail('Ngày bắt đầu', convertToDDMMYYYYHHMM(eventsProvider.selected.startDate), Icon(Icons.looks_one_outlined)),
                        _createDetail(
                            'Ngày kết thúc',
                            convertToDDMMYYYYHHMM(eventsProvider.selected.endDate).length == 0 ? '--' : convertToDDMMYYYYHHMM(eventsProvider.selected.endDate),
                            Icon(Icons.looks_two_outlined)),
                        eventsProvider.selected.status
                            ? _createDetail('Ngày giao dịch kế tiếp', convertToDDMMYYYYHHMM(eventsProvider.selected.nextDate), Icon(Icons.next_plan_outlined))
                            : Container(),
                        _createDetail('Loại', (() {
                          int type = int.parse(eventsProvider.selected.eventTypeID);

                          if (type == 1) {
                            // hằng ngày
                            return eventsProvider.selected.typeName;
                          }
                          if (type == 2) {
                            // hằng tuần
                            return eventsProvider.selected.typeName + ' (vào ${everyWeek[eventsProvider.selected.value]})';
                          }
                          if (type == 3) {
                            // hằng tháng
                            return eventsProvider.selected.typeName + ' (vào ngày ${eventsProvider.selected.value})';
                          }
                          if (type == 4) {
                            // hằng năm
                            return eventsProvider.selected.typeName + ' (vào ngày ${(eventsProvider.selected.value ~/ 1000) + 1}/${(eventsProvider.selected.value % 1000) + 1})';
                          }
                        })(), Icon(Icons.event_available)),
                        // _createDetail('Ghi chú', eventsProvider.selected.description.length == 0 ? 'Không có chú thích được tạo' : eventsProvider.selected.description,
                        //     Icon(Icons.textsms_outlined)),
                      ],
                    )
                  : Container();
            })),
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
