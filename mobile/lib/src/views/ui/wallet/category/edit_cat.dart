import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
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
  final Map<String, dynamic> cat;

  const EditCatDialog({Key key, @required this.walletID, @required this.cat, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _EditCatDialogState createState() => _EditCatDialogState();
}

class _EditCatDialogState extends State<EditCatDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();

  List<DropdownMenuItem<String>> _catMenuItems = [];
  List<dynamic> _iconList = [];
  String _currentIcon;

  var _nameController = new TextEditingController();

  @override
  void initState() {
    super.initState();

    for (String key in widget.cat.keys) print('${key} - ${widget.cat[key]}');

    _initPage();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          elevation: 0,
          backgroundColor: Colors.white,
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(15, 0, 15, 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Align(
                    alignment: Alignment.centerRight,
                    child: IconButton(
                      icon: Icon(Icons.close),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 15.0),
                    child: Text(
                      'Thay đổi thông tin loại giao dich',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
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
                                _currentIcon = value;
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
                  myAlignedButton('Sửa', backgroundColor: primary, action: () {
                    if (_formKey.currentState.validate()) {
                      showSnack(_scaffoldKey, 'Đang xử lý...');
                      handleEditCat();
                    }
                  })
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void handleEditCat() async {
    // print(_nameController.text);
    // print(_currentIcon);

    Socket socket = await getSocket();

    print(socket.id);
    print(widget.cat['ID']);
    print(widget.cat['WalletID']);
    print(widget.cat['IsDefault']);

    socket.emitWithAck('update_category', {
      'walletID': widget.walletID,
      'categoryID': widget.cat['ID'],
      'newCategory': {'IconID': _currentIcon, 'Name': _nameController.text, 'ID': widget.cat['ID'], 'WalletID': widget.cat['WalletID'], 'IsDefault': widget.cat['IsDefault']}
    }, ack: () {
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, 'Cập nhật thành công');
    });
  }

  void _initPage() async {
    _iconList = jsonDecode(await WalletService.instance.getListIcon());

    if (_iconList.length != 0) {
      for (dynamic icon in _iconList) {
        _catMenuItems.add(new DropdownMenuItem(
          child: _createCircleIcon(icon['Name'], icon['BackgroundColor'], icon['Color']),
          value: icon['ID'],
        ));
      }

      // print(widget.cat['IconID']);
      _currentIcon = widget.cat['IconID'];
      _nameController.text = widget.cat['Name'];
    }

    setState(() {});
  }

  _createCircleIcon(String name, String background, String foreground) => CircleAvatar(
        backgroundColor: Color(int.parse('0x' + background.substring(2))),
        foregroundColor: Color(int.parse('0x' + foreground.substring(2))),
        child: FlutterLogo(size: 25.0),
      );
}
