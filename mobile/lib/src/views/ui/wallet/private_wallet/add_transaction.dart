import 'package:flutter/material.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class AddTransactionDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String walletID;
  final List<dynamic> eventList;
  final List<dynamic> fullCategoryList;

  const AddTransactionDialog({Key key, @required this.walletID, @required this.fullCategoryList, @required this.eventList, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _AddTransactionDialogState createState() => _AddTransactionDialogState();
}

class _AddTransactionDialogState extends State<AddTransactionDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();

  // data section for new transaction

  // thu hoắc chi
  List<DropdownMenuItem<String>> _txTypeMenuItems = [];
  List _typeList = ['Chi', 'Thu'];
  String _currentType;

  var _priceController = TextEditingController(text: formatMoneyWithoutSymbol(0));

  var _selectedDate = DateTime.now();
  var _datetimeController = TextEditingController();

  // thể loại giao dịch
  List<DropdownMenuItem<String>> _txCategoryMenuItems = [];
  String _currentCategory;

  // tên sự kiện
  List<DropdownMenuItem<String>> _availableEventMenuItems = [];
  String _currentEvent;

  var _descriptionController = TextEditingController(text: "");

  @override
  void initState() {
    super.initState();

    for (String type in _typeList) {
      _txTypeMenuItems.add(new DropdownMenuItem(
          child: Text(
            type,
            style: TextStyle(color: type == 'Chi' ? Colors.red : Colors.green),
          ),
          value: type));
    }
    _currentType = _txTypeMenuItems[0].value;

    for (Map<String, dynamic> cat in widget.fullCategoryList) {
      _txCategoryMenuItems.add(new DropdownMenuItem(
        child: Row(
          children: [
            FlutterLogo(size: 24),
            Padding(
              padding: const EdgeInsets.only(left: 20.0),
              child: Text(cat['Name']),
            ),
          ],
        ),
        value: cat['ID'],
      ));
    }
    _currentCategory = _txCategoryMenuItems[0].value;

    for (Map<String, dynamic> event in widget.eventList) {
      _availableEventMenuItems.add(new DropdownMenuItem(child: Text(event['Name']), value: event['ID']));
    }
    _currentEvent = null;

    _datetimeController.text = convertToDDMMYYYYHHMM(_selectedDate.toLocal().toString());
  }

  @override
  void dispose() {
    _priceController.dispose();
    _descriptionController.dispose();
    _datetimeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          elevation: 0,
          insetPadding: EdgeInsets.symmetric(horizontal: 5),
          backgroundColor: Colors.white,
          child: SingleChildScrollView(
            child: Container(
              margin: const EdgeInsets.fromLTRB(10, 0, 10, 20),
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
                      'Thêm khoản giao dịch mới',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(bottom: 20.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 10.0),
                            child: Row(
                              children: [
                                Container(
                                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                                  decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton(
                                      value: _currentType,
                                      items: _txTypeMenuItems,
                                      onChanged: changeType,
                                    ),
                                  ),
                                ),
                                Expanded(
                                  child: Container(
                                    margin: EdgeInsets.only(left: 10),
                                    child: TextFormField(
                                      controller: _priceController,
                                      keyboardType: TextInputType.number,
                                      decoration: myInputDecoration('Số tiền', inputBorder: Colors.black26, suffix: Text(formatter.currencySymbol)),
                                      style: TextStyle(color: _currentType == 'Chi' ? Colors.red : Colors.green),
                                      onChanged: (value) {
                                        TextSelection previousSelection = _priceController.selection;
                                        String copy = value.replaceAll(new RegExp(r'[^0-9]'), ''); // bỏ tất cả chỉ giữ lại số
                                        try {
                                          copy = formatMoneyWithoutSymbol(double.parse(copy));
                                        } on FormatException {
                                          _priceController.text = '0';
                                          return;
                                        }
                                        _priceController.text = copy;
                                        // if (previousSelection.i == false) {
                                        //   print('false');
                                        //   _priceController.selection = TextSelection.fromPosition(TextPosition(offset: _priceController.text.length));
                                        // } else {
                                        //   print('true');
                                        _priceController.selection = previousSelection;
                                        // }
                                      },
                                      validator: (String value) {
                                        if (value.isEmpty) {
                                          return 'Số tiền không được để trống';
                                        }
                                        if(double.parse(value.replaceAll(new RegExp(r'[^0-9]'), '')) == 0){
                                          return 'Số tiền không hợp lệ';
                                        }
                                        return null;
                                      },
                                    ),
                                  ),
                                )
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            child: TextFormField(
                              controller: _datetimeController,
                              showCursor: true,
                              readOnly: true,
                              // keyboardType: TextInputType.datetime,
                              decoration: myInputDecoration('Bạn chưa chọn thời gian', inputBorder: Colors.black26),
                              onTap: () {
                                _selectDatetime();
                              },
                              validator: (String value) {
                                return null;
                              },
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.symmetric(vertical: 10),
                            padding: EdgeInsets.symmetric(horizontal: 10),
                            decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                            child: DropdownButtonFormField(
                              hint: Text('Chọn hạng mục chi tiêu'),
                              decoration: InputDecoration(
                                enabledBorder: InputBorder.none,
                              ),
                              value: _currentCategory,
                              items: _txCategoryMenuItems,
                              onChanged: changeCat,
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.symmetric(vertical: 10),
                            padding: EdgeInsets.symmetric(horizontal: 10),
                            decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                            child: DropdownButtonFormField(
                              hint: Text('Chọn sự kiện'),
                              decoration: InputDecoration(
                                enabledBorder: InputBorder.none,
                              ),
                              value: _currentEvent,
                              items: _availableEventMenuItems,
                              onChanged: (value) {
                                setState(() {
                                  _currentEvent = value;
                                });
                              },
                            ),
                          ),
                          Container(
                            margin: EdgeInsets.symmetric(vertical: 10),
                            child: TextFormField(
                              maxLines: 5,
                              maxLength: 500,
                              controller: _descriptionController,
                              decoration: myInputDecoration('Mô tả', inputBorder: Colors.black26),
                              validator: (String value) {
                                if (value.length > 500) {
                                  return 'Mô tả không được quá 500 ký tự';
                                }
                                return null;
                              },
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                  myAlignedButton('Thêm', backgroundColor: primary, action: () {
                    if (_formKey.currentState.validate()) {
                      showSnack(_scaffoldKey, 'Đang xử lý...');
                      handleAddTx();
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

  void _selectDatetime() async {
    final DateTime picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
      helpText: 'Chọn thời gian giao dịch',
      cancelText: 'Hủy',
      confirmText: 'Chọn',
      errorFormatText: 'Thời gian không đúng định dạng',
      errorInvalidText: 'Thời gian không hợp lệ',
      initialDatePickerMode: DatePickerMode.day,
    );
    print(picked);
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      print(picked.toString());
      print(picked.toIso8601String());
      print(picked.toLocal().toString());
      _datetimeController.text = convertToDDMMYYYY(picked.toUtc().toIso8601String());
    }
  }

  void changeType(String selectedType) {
    setState(() {
      _currentType = selectedType;
    });
  }

  void changeCat(String selectedType) {
    setState(() {
      _currentCategory = selectedType;
    });
  }

  void handleAddTx() async {
    Socket socket = await getSocket();
    final price = double.parse(_priceController.text.replaceAll(new RegExp(r'[^0-9]'), ''));
    Map<String, dynamic> newTx = {
      'catID': _currentCategory,
      'eventID': _currentEvent,
      'price': _currentType == 'Chi' ? price * -1 : price,
      'time': _selectedDate.toIso8601String(),
      'description': _descriptionController.text
    };
    showSnack(_scaffoldKey, 'Đang xử lý...');
    socket.emitWithAck('add_transaction', {'walletID': widget.walletID, 'newTransaction': newTx}, ack: (data)  {
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, "Thêm thành công");
    });
    // for (String key in newTx.keys) {
    //   print('${key} - ${newTx[key]}');
    // }
  }
}
