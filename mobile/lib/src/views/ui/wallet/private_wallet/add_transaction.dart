import 'package:flutter/material.dart';
import 'package:mobile/src/models/CatsProvider.dart';
import 'package:mobile/src/models/EventsProvider.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/services/icon_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart';

class AddTransaction extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;

  const AddTransaction({Key key, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _AddTransactionState createState() => _AddTransactionState();
}

class _AddTransactionState extends State<AddTransaction> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();
  List<IconCustom> _iconList = [];

  // data section for new transaction

  // thu hoắc chi
  List<DropdownMenuItem<String>> _txTypeMenuItems = [];
  List _typeList = ['Chi', 'Thu'];
  String _currentType;

  var _priceController = TextEditingController(text: formatMoneyWithoutSymbol(0));

  var _selectedDatetime = DateTime.now().toLocal(); // ex: 2021-05-19 23:17:11.279652

  var _datetimeController = TextEditingController();

  // thể loại giao dịch
  String _currentCategory;

  // tên sự kiện
  String _currentEvent;

  var _descriptionController = TextEditingController(text: "");

  _initPage() async {
    _iconList = await IconService.instance.iconList;

    setState(() {});
  }

  @override
  void initState() {
    _initPage();
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

    _currentCategory = null;
    _currentEvent = null;

    _datetimeController.text = convertToDDMMYYYYHHMM(_selectedDatetime.toLocal().toString());
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
    return GestureDetector(
        onTap: () {
          FocusManager.instance.primaryFocus.unfocus();
        },
        child: ScaffoldMessenger(
          key: _scaffoldKey,
          child: Scaffold(
            appBar: mySimpleAppBar('Thêm giao dịch mới'),
            // backgroundColor: Colors.transparent,
            body: SingleChildScrollView(
              child: Container(
                margin: const EdgeInsets.fromLTRB(10, 0, 10, 20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(top: 10, bottom: 20.0),
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
                                        onTap: () {
                                          FocusManager.instance.primaryFocus.unfocus();
                                        },
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
                                          TextSelection cursorPos = _priceController.selection;

                                          String copy = value.replaceAll(new RegExp(r'[^0-9]'), ''); // bỏ tất cả chỉ giữ lại số
                                          try {
                                            copy = formatMoneyWithoutSymbol(double.parse(copy));
                                          } on FormatException {
                                            copy = '0';
                                          }
                                          _priceController.text = copy;

                                          // đưa cursor về chỗ hợp lý
                                          // if (cursorPos.start > _priceController.text.length) {
                                          cursorPos = new TextSelection.fromPosition(new TextPosition(offset: _priceController.text.length));
                                          // } else {
                                          //   cursorPos = new TextSelection.fromPosition(
                                          //       new TextPosition(offset: _priceController.text.length + 1));
                                          // }
                                          _priceController.selection = cursorPos;
                                        },
                                        validator: (String value) {
                                          if (value.isEmpty) {
                                            return 'Số tiền không được để trống';
                                          }
                                          if (double.parse(value.replaceAll(new RegExp(r'[^0-9]'), '')) == 0) {
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
                                child: Consumer<CatsProvider>(builder: (context, catsProvider, child) {
                                  // catsProvider.fullList.indexWhere((element) => element.id == _currentCategory) == -1 ? s
                                  return DropdownButtonFormField(
                                    hint: Text('Chọn hạng mục chi tiêu'),
                                    decoration: InputDecoration(
                                      enabledBorder: InputBorder.none,
                                    ),
                                    value: _currentCategory == null ? catsProvider.fullList[0].id : _currentCategory,
                                    items: catsProvider.fullList.map<DropdownMenuItem<String>>((Categories cat) {
                                      IconCustom selectedIcon = _iconList.firstWhere((element) => element.id == cat.iconID,
                                          orElse: () => new IconCustom(id: '', name: '', color: '', backgroundColor: ''));

                                      return DropdownMenuItem(
                                        child: Row(
                                          children: [
                                            Container(width: 28, height: 28, child: myCircleIcon(selectedIcon.name, selectedIcon.backgroundColor, selectedIcon.color, size: 16)),
                                            Padding(
                                              padding: const EdgeInsets.only(left: 10.0),
                                              child: Text(cat.name),
                                            ),
                                          ],
                                        ),
                                        value: cat.id,
                                      );
                                    }).toList(),
                                    onChanged: (value) {
                                      if(catsProvider.fullList.indexWhere((element) => element.id == value) == -1) {
                                        changeCat(catsProvider.fullList[0].id);
                                        return;
                                      }
                                      changeCat(value);
                                    },
                                    onTap: () {
                                      FocusManager.instance.primaryFocus.unfocus();
                                    },
                                  );
                                })),
                            Container(
                                margin: EdgeInsets.symmetric(vertical: 10),
                                padding: EdgeInsets.symmetric(horizontal: 10),
                                decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                                child: Consumer<EventsProvider>(builder: (context, eventsProvider, child) {
                                  return DropdownButtonFormField(
                                    hint: Text('Chọn sự kiện'),
                                    decoration: InputDecoration(
                                      enabledBorder: InputBorder.none,
                                    ),
                                    value: _currentEvent,
                                    items: eventsProvider.eventList.map<DropdownMenuItem<String>>((Events event) {
                                      return DropdownMenuItem(child: Text(event.name), value: event.id);
                                    }).toList(),
                                    onChanged: (value) {
                                      setState(() {
                                        _currentEvent = value;
                                      });
                                    },
                                    onTap: () {
                                      FocusManager.instance.primaryFocus.unfocus();
                                    },
                                  );
                                })),
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
                    myFullWidthButton('Thêm giao dịch', backgroundColor: primary, action: () {
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
        ));
  }

  void _selectDatetime() async {
    final currentDatetime = DateTime.now();
    final DateTime picked = await showDatePicker(
      context: context,
      initialDate: _selectedDatetime,
      firstDate: DateTime(1900),
      lastDate: currentDatetime,
      helpText: 'Chọn ngày giao dịch',
      cancelText: 'Hủy',
      confirmText: 'Chọn',
      errorFormatText: 'Thời gian không đúng định dạng',
      errorInvalidText: 'Thời gian không hợp lệ',
      initialDatePickerMode: DatePickerMode.day,
    );

    final TimeOfDay pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay(hour: _selectedDatetime.hour, minute: _selectedDatetime.minute),
        helpText: 'Chọn giờ giao dịch',
        cancelText: 'Hủy',
        confirmText: 'Chọn');

    if (picked != null && pickedTime != null) {
      DateTime result = DateTime(picked.year, picked.month, picked.day, pickedTime.hour, pickedTime.minute);

      if (result.isAfter(currentDatetime)) {
        result = currentDatetime;
      }

      setState(() {
        _selectedDatetime = result;
      });
      _datetimeController.text = convertToDDMMYYYYHHMM(result.toString());
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
    double price;

    try {
      price = double.parse(_priceController.text.replaceAll(new RegExp(r'[^0-9]'), ''));
    } on Exception {
      showSnack(_scaffoldKey, 'Số tiền không hợp lệ');
      return;
    }

    List<Categories> fullList = Provider.of<CatsProvider>(context, listen: false).fullList;
    final Map<String, dynamic> newTx = {
      'catID': _currentCategory == null ? fullList[0].id : _currentCategory,
      'eventID': _currentEvent,
      'price': _currentType == 'Chi' ? price * -1 : price,
      'time': _selectedDatetime.toUtc().toIso8601String(),
      'description': _descriptionController.text
    };


    showSnack(_scaffoldKey, 'Đang xử lý...');
    String walletID = Provider.of<UsersProvider>(context, listen: false).info.walletID;
    socket.emitWithAck('add_transaction', {'walletID': walletID, 'newTransaction': newTx}, ack: (data) {
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, "Thêm thành công");
    });
  }
}
