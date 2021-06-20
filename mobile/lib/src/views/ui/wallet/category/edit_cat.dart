import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/models/CatsProvider.dart';
import 'package:mobile/src/services/icon_service.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/wallet/category/category_dashboard.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class EditCatDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String walletID;
  final Categories cat;

  const EditCatDialog({Key key, @required this.walletID, @required this.cat, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _EditCatDialogState createState() => _EditCatDialogState();
}

class _EditCatDialogState extends State<EditCatDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();

  List<DropdownMenuItem<String>> _catMenuItems = [];
  List<IconCustom> _iconList = [];
  String _currentIcon;

  var _nameController = new TextEditingController();

  @override
  void initState() {
    _initPage();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          elevation: 0,
          backgroundColor: Colors.white,
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(15, 0, 15, 5),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 20, bottom: 15),
                      child: Text(
                        'Thay đổi loại',
                        style:
                        TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 20.0),
                    child: Row(
                      children: [
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                          decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton(
                              value: _currentIcon,
                              items: _catMenuItems,
                              onChanged: (value) {
                                setState(() {
                                  _currentIcon = value;
                                });
                              },
                            ),
                          ),
                        ),
                        Expanded(
                          child: Container(
                            margin: EdgeInsets.only(left: 10),
                            child: Form(
                              key: _formKey,
                              child: TextFormField(
                                controller: _nameController,
                                decoration: myInputDecoration('Tên phân loại', inputBorder: Colors.black26),
                                validator: (String value) {
                                  if (value.isEmpty || value.trim().length == 0) {
                                    return 'Tên không được để trống';
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: Text(
                            'Hủy',
                            style: TextStyle(fontSize: 16, color: Colors.green),
                          )),
                      TextButton(
                          onPressed: () {
                            if (_formKey.currentState.validate()) {
                              showSnack(_scaffoldKey, 'Đang xử lý...');
                              handleEditCat();
                            }
                          },
                          child: Text(
                            'Sửa',
                            style: TextStyle(fontSize: 16, color: Colors.green),
                          )),
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
    );
  }

  void handleEditCat() async {
    Socket socket = await getSocket();

    socket.emitWithAck('update_category', {
      'walletID': widget.walletID,
      'categoryID': widget.cat.id,
      'newCategory': {'IconID': _currentIcon, 'Name': _nameController.text, 'ID': widget.cat.id, 'WalletID': widget.cat.walletID, 'IsDefault': widget.cat.isDefault}
    }, ack: () {
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, 'Cập nhật thành công');
    });
  }

  void _initPage() async {
    _currentIcon = widget.cat.iconID;
    _nameController.text = widget.cat.name;

    _iconList = await IconService.instance.iconList;

    if (!mounted) {
      return;
    }
    if (_iconList.length != 0) {
      for (IconCustom icon in _iconList) {
        _catMenuItems.add(new DropdownMenuItem(
          child: Container(
              width: 28,
              height: 28,
              child: myCircleIcon(
                  icon.name,
                  icon.backgroundColor,
                  icon.color,
                  size: 16)),
          value: icon.id,
        ));
      }
    }

    setState(() {});
  }
}
