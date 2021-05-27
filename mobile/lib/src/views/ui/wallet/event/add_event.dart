import 'package:flutter/material.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:socket_io_client/socket_io_client.dart';

class AddEvent extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String walletID;
  final List<dynamic> eventTypeList;
  final List<dynamic> fullCategoryList;

  const AddEvent({Key key, @required this.walletID, @required this.fullCategoryList, @required this.eventTypeList, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _AddEventState createState() => _AddEventState();
}

class _AddEventState extends State<AddEvent> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();

  // data section for new event

  var _nameController = new TextEditingController();

  // loại sự kiện
  List<DropdownMenuItem<String>> _availableEventTypeItems = [];
  String _currentEventType;

  // giá trị của loại sự kiện tương ứng
  List<DropdownMenuItem<String>> _values = [];
  String _currentValue;

  // thời gian kết thúc sự kiện
  List _endDateList = ['Vô thời hạn', 'Vào lúc'];
  List<DropdownMenuItem<String>> _availableEndDateItems = [];
  String _currentEndDateType;

  // thu hoắc chi
  List<DropdownMenuItem<String>> _availableTxTypeItems = [];
  List _typeList = ['Chi', 'Thu'];
  String _currentTxType;

  var _priceController = TextEditingController(text: formatMoneyWithoutSymbol(0));

  var _selectedEndDatetime = DateTime.now().toLocal(); // ex: 2021-05-19 23:17:11.279652

  var _endDatetimeController = TextEditingController();

  // thể loại giao dịch
  List<DropdownMenuItem<String>> _availableCatItems = [];
  String _currentCategory;

  var _descriptionController = TextEditingController(text: "");

  @override
  void initState() {
    super.initState();

    for (dynamic eventType in widget.eventTypeList) {
      _availableEventTypeItems.add(new DropdownMenuItem(
        child: Text(eventType['Name']),
        value: eventType['ID'],
      ));
    }
    _currentEventType = _availableEventTypeItems[0].value;

    _handleChangeEventType(_currentEventType);

    for (String endDate in _endDateList) {
      _availableEndDateItems.add(new DropdownMenuItem(
          child: Text(
            endDate,
          ),
          value: endDate == 'Vô thời hạn' ? 'false' : 'true'));
    }
    _currentEndDateType = _availableEndDateItems[0].value;

    for (String type in _typeList) {
      _availableTxTypeItems.add(new DropdownMenuItem(
          child: Text(
            type,
            style: TextStyle(color: type == 'Chi' ? Colors.red : Colors.green),
          ),
          value: type));
    }
    _currentTxType = _availableTxTypeItems[0].value;

    for (Map<String, dynamic> cat in widget.fullCategoryList) {
      _availableCatItems.add(new DropdownMenuItem(
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
    _currentCategory = _availableCatItems[0].value;

    _endDatetimeController.text = convertToDDMMYYYYHHMM(_selectedEndDatetime.toLocal().toString());
  }

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    _descriptionController.dispose();
    _endDatetimeController.dispose();
    super.dispose();
  }

  _handleChangeEventType(String newEventType) {
    List<String> _valuesOfEventType = getValueOfEventType(newEventType);
    List<DropdownMenuItem<String>> values = [];

    if (newEventType == '3') {
      for (int i = 0; i < _valuesOfEventType.length; i++) {
        values.add(new DropdownMenuItem(child: Text(_valuesOfEventType[i]), value: '${i + 1}'));
      }
    } else {
      for (int i = 0; i < _valuesOfEventType.length; i++) {
        values.add(new DropdownMenuItem(child: Text(_valuesOfEventType[i]), value: '$i'));
      }
    }

    setState(() {
      _currentEventType = newEventType;
      _values = values;
      _currentValue = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        appBar: mySimpleAppBar('Thêm sự kiện mới'),
        // backgroundColor: Colors.transparent,
        body: SingleChildScrollView(
          child: Container(
            margin: const EdgeInsets.fromLTRB(10, 20, 10, 20),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Align(alignment: Alignment.centerLeft, child: Text('Thông tin sự kiện', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25))),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    child: TextFormField(
                      controller: _nameController,
                      decoration: myInputDecoration('Tên sự kiện', inputBorder: Colors.black26),
                      validator: (String value) {
                        if (value.isEmpty || value.trim().length == 0) {
                          return 'Tên sự kiện không được để trống';
                        }
                        return null;
                      },
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 10),
                    // padding: EdgeInsets.symmetric(horizontal: 10),
                    // decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                    child: DropdownButtonFormField(
                      hint: Text('Loại sự kiện'),
                      decoration: myInputDecoration('', label: 'Loại sự kiện', inputBorder: Colors.black26),
                      value: _currentEventType,
                      items: _availableEventTypeItems,
                      onChanged: (value) {
                        _handleChangeEventType(value);
                      },
                    ),
                  ),
                  _currentEventType != '1'
                      ? Container(
                          margin: EdgeInsets.symmetric(vertical: 10),
                          // padding: EdgeInsets.symmetric(horizontal: 10),
                          // decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                          child: DropdownButtonFormField(
                            hint: Text('Vào thời điểm'),
                            decoration: myInputDecoration('', inputBorder: Colors.black26),
                            value: _currentValue,
                            items: _values,
                            onChanged: (value) {
                              setState(() {
                                _currentValue = value;
                              });
                            },
                            validator: (String value) {
                              if (value == null) {
                                return 'Thời điểm không dược để trống';
                              }
                              return null;
                            },
                          ))
                      : Container(),
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 10),
                    // padding: EdgeInsets.symmetric(horizontal: 10),
                    // decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                    child: DropdownButtonFormField(
                      hint: Text('Kết thúc'),
                      decoration: myInputDecoration('', label: 'Kết thúc', inputBorder: Colors.black26),
                      value: _currentEndDateType,
                      items: _availableEndDateItems,
                      onChanged: (value) {
                        setState(() {
                          _currentEndDateType = value;
                        });
                      },
                    ),
                  ),
                  _currentEndDateType == 'true'
                      ? Padding(
                          padding: const EdgeInsets.only(top: 10),
                          child: TextFormField(
                            controller: _endDatetimeController,
                            showCursor: true,
                            readOnly: true,
                            decoration: myInputDecoration('Bạn chưa chọn thời gian', inputBorder: Colors.black26),
                            onTap: () {
                              _selectDatetime();
                            },
                            validator: (String value) {
                              return null;
                            },
                          ),
                        )
                      : Container(),
                  Padding(
                    padding: const EdgeInsets.only(top: 30.0),
                    child: Align(alignment: Alignment.centerLeft, child: Text('Thông tin giao dịch định kỳ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25))),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10.0),
                    child: Row(
                      children: [
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                          decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton(
                              value: _currentTxType,
                              items: _availableTxTypeItems,
                              onChanged: _changeTxType,
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
                              style: TextStyle(color: _currentTxType == 'Chi' ? Colors.red : Colors.green),
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
                      items: _availableCatItems,
                      onChanged: _changeTxCat,
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
                  ),
                  myFullWidthButton('Thêm sự kiện', backgroundColor: primary, action: () {
                    if (_formKey.currentState.validate()) {
                      showSnack(_scaffoldKey, 'Đang xử lý...');
                      _handleAddEvent();
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
    final currentDatetime = DateTime.now();
    final DateTime pickedDate = await showDatePicker(
      context: context,
      initialDate: _selectedEndDatetime,
      firstDate: currentDatetime,
      lastDate: DateTime(2100),
      helpText: 'Chọn ngày kết thúc sự kiện',
      cancelText: 'Hủy',
      confirmText: 'Chọn',
      errorFormatText: 'Thời gian không đúng định dạng',
      errorInvalidText: 'Thời gian không hợp lệ',
      initialDatePickerMode: DatePickerMode.year,
    );

    final TimeOfDay pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay(hour: _selectedEndDatetime.hour, minute: _selectedEndDatetime.minute),
        helpText: 'Chọn giờ kết thúc sự kiện',
        cancelText: 'Hủy',
        confirmText: 'Chọn');

    if (pickedDate != null && pickedTime != null) {
      DateTime result = DateTime(pickedDate.year, pickedDate.month, pickedDate.day, pickedTime.hour, pickedTime.minute);

      if (result.isBefore(currentDatetime)) {
        result = currentDatetime;
      }

      setState(() {
        _selectedEndDatetime = result;
      });
      _endDatetimeController.text = convertToDDMMYYYYHHMM(result.toString());
    }
  }

  void _changeTxType(String selectedType) {
    setState(() {
      _currentTxType = selectedType;
    });
  }

  void _changeTxCat(String selectedType) {
    setState(() {
      _currentCategory = selectedType;
    });
  }

  void _handleAddEvent() async {
    Socket socket = await getSocket();
    double price;

    try {
      price = double.parse(_priceController.text.replaceAll(new RegExp(r'[^0-9]'), ''));
    } on Exception {
      showSnack(_scaffoldKey, 'Số tiền không hợp lệ');
      return;
    }

    String eventTypeName = widget.eventTypeList.where((element) => element['ID'] == _currentEventType).first['Name'];

    final Map<String, dynamic> newEvent = {
      'Name': _nameController.text,
      'StartDate': DateTime.now().toIso8601String(),
      'EndDate': _currentEndDateType == 'true' ? _selectedEndDatetime.toIso8601String() : null,
      'Value': _currentValue == null ? 0 : int.parse(_currentValue),
      'ExpectingAmount': _currentTxType == 'Chi' ? price * -1 : price,
      'CategoryID': _currentCategory,
      'EventTypeID': _currentEventType,
      'TypeName': eventTypeName,
      'Description': _descriptionController.text
    };

    showSnack(_scaffoldKey, 'Đang xử lý...');
    socket.emitWithAck('add_event', {'walletID': widget.walletID, 'newEvent': newEvent}, ack: () {
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, "Thêm thành công");
    });
  }
}
