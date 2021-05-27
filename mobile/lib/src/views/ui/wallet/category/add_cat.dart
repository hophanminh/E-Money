import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class AddCatDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String walletID;

  const AddCatDialog({Key key, @required this.walletID, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _AddCatDialogState createState() => _AddCatDialogState();
}

class _AddCatDialogState extends State<AddCatDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();

  List<DropdownMenuItem<String>> _catMenuItems = [];
  List<dynamic> _iconList = [];
  String _currentIcon;

  var _nameController = new TextEditingController();

  @override
  void initState() {
    super.initState();
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
                      'Thêm loại mới',
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
                  myAlignedButton('Thêm', backgroundColor: primary, action: () {
                    if (_formKey.currentState.validate()) {
                      showSnack(_scaffoldKey, 'Đang xử lý...');
                      handleAddCat();
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

  void handleAddCat() async {
    print(_nameController.text);
    print(_currentIcon);

    Socket socket = await getSocket();

    socket.emit('add_category', {
      'walletID': widget.walletID,
      'newCategory': {'IconID': _currentIcon, 'Name': _nameController.text}
    });
    Navigator.pop(context);
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

      _currentIcon = _catMenuItems[0].value;
    }
    setState(() {});
  }

  _createCircleIcon(String name, String background, String foreground) => CircleAvatar(
        backgroundColor: Color(int.parse('0x' + background.substring(2))),
        foregroundColor: Color(int.parse('0x' + foreground.substring(2))),
        child: FlutterLogo(size: 25.0),
      );
}
