import 'dart:io';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:mobile/src/services/icon_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:outline_material_icons/outline_material_icons.dart';
import 'package:socket_io_client/socket_io_client.dart';

class RollbackViewDetail extends StatefulWidget {
  final dynamic data;
  final int version;
  final bool isCurrent;
  final void Function(dynamic) handleRestore;

  const RollbackViewDetail({Key key, @required this.data, @required this.version, @required this.isCurrent, @required this.handleRestore}) : super(key: key);

  @override
  _RollbackViewDetailState createState() => _RollbackViewDetailState();
}

class _RollbackViewDetailState extends State<RollbackViewDetail> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  IconCustom _selectedIcon = IconCustom(id: '', name: '', color: '', backgroundColor: '');
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
    _selectedIcon = _iconList.firstWhere((element) => element.id == widget.data['IconID'], orElse: () => new IconCustom(id: '', name: '', color: '', backgroundColor: ''));

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
          child: Column(
            children: [
              Container(
                  decoration: BoxDecoration(
                    border: Border.all(width: 0, color: primary),
                    color: primary,
                    // gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [primary, const Color(0xFFb4dc63)])
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
                                color: Color(int.parse('0xFF' + (_selectedIcon.backgroundColor == '' ? '#FFFFFF' : _selectedIcon.backgroundColor).substring(1))),
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
                              child: _selectedIcon.name == ''
                                  ? Container()
                                  : Icon(
                                      IconData(int.parse('${OMIcons.codePoints[_selectedIcon.name]}'), fontFamily: 'outline_material_icons', fontPackage: 'outline_material_icons'),
                                      size: 90,
                                      color: Colors.white,
                                    ))),
                      Text(
                        widget.data['CategoryName'],
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
                      )
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  '${formatMoneyWithSymbol(widget.data['Money'])}',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 45, color: widget.data['Money'] > 0 ? Colors.green : Colors.red),
                ),
              ),
              _createDetail('Ngày giao dịch', convertToDDMMYYYYHHMM(widget.data['DateAdded']), Icon(Icons.looks_one_outlined)),
              _createDetail('Phiên bản', '${widget.version} ${widget.isCurrent ? '(hiện tại)' : ''}', Icon(Icons.alt_route_outlined)),
              _createDetail('Ngày sửa đổi', convertToDDMMYYYYHHMM(widget.data['DateModified']), Icon(Icons.looks_two_outlined)),
              _createDetail('Sự kiện', widget.data['EventName'] == null ? 'Không có sự kiện được chọn' : widget.data['EventName'], Icon(Icons.event_available)),
              _createDetail('Ghi chú', widget.data['Description'].length == 0 ? 'Không có chú thích được tạo' : widget.data['Description'], Icon(Icons.textsms_outlined)),
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
      title: Text('Lịch sử thay đổi', style: TextStyle(color: Colors.white)),
      actions: [
        widget.isCurrent
            ? Container()
            : TextButton(
                child: Text('Phục hồi', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w400)),
                onPressed: () {
                  widget.handleRestore(widget.data);
                  Navigator.pop(context);
                },
              ),
      ],
      backgroundColor: primary,
      centerTitle: true);
}
