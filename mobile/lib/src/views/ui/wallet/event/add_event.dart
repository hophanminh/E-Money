import 'package:flutter/material.dart';
import 'package:mobile/src/models/CatsProvider.dart';
import 'package:mobile/src/models/EventsProvider.dart';
import 'package:mobile/src/services/icon_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart';

class AddEvent extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;
  final String walletID;

  const AddEvent({Key key, @required this.walletID, @required this.wrappingScaffoldKey}) : super(key: key);

  @override
  _AddEventState createState() => _AddEventState();
}

class _AddEventState extends State<AddEvent> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();
  List<IconCustom> _iconList = [];

  // data section for new event

  var _nameController = new TextEditingController();

  // loại sự kiện
  List<DropdownMenuItem<String>> _availableEventTypeItems = [];
  String _currentEventType;

  // giá trị của loại sự kiện tương ứng
  List<DropdownMenuItem<String>> _values = [];
  List<DropdownMenuItem<String>> _values2 = [];
  String _currentValue;
  String _currentValue2;

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

  var _selectedStartDatetime = DateTime.now().toLocal(); // ex: 2021-05-19 23:17:11.279652

  var _endDatetimeController = TextEditingController();

  var _startDatetimeController = TextEditingController();

  // thể loại giao dịch
  List<DropdownMenuItem<String>> _availableCatItems = [];
  String _currentCategory;

  // var _descriptionController = TextEditingController(text: "");

  _initPage() async {
    _iconList = await IconService.instance.iconList;

    setState(() {});
  }

  @override
  void initState() {
    _initPage();
    super.initState();
    EventsProvider eventsProvider = Provider.of<EventsProvider>(context, listen: false);

    _currentEventType = eventsProvider.eventTypeList[0].id;

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

    _currentCategory = null;

    _endDatetimeController.text = convertToDDMMYYYYHHMM(_selectedEndDatetime.toLocal().toString());

    var now = DateTime.now();
    DateTime temp = DateTime(now.year, now.month, now.day, 0, 0);
    _startDatetimeController.text = convertToHHMM(temp.toLocal().toString());
    setState(() {
      _selectedStartDatetime = temp.toLocal(); // ex: 2021-05-19 23:17:11.279652
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    // _descriptionController.dispose();
    _endDatetimeController.dispose();
    _startDatetimeController.dispose();
    super.dispose();
  }

  _handleChangeEventType(String newEventType) {
    List<String> _valuesOfEventType = getValueOfEventType(newEventType);
    List<DropdownMenuItem<String>> values = [];
    List<DropdownMenuItem<String>> values2 = [];

    if (newEventType == '4') {
      for (int i = 0; i < _valuesOfEventType.length; i++) {
        values.add(new DropdownMenuItem(child: Text(_valuesOfEventType[i]), value: '$i'));
      }

      List<String> _valuesOfEventType2 = getValueOfEventType("3");
      for (int i = 0; i < _valuesOfEventType2.length; i++) {
        values2.add(new DropdownMenuItem(child: Text(_valuesOfEventType2[i]), value: '$i'));
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
      _values2 = values2;
      _currentValue2 = null;
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
                      child: Consumer<EventsProvider>(builder: (context, eventsProvider, child) {
                        return DropdownButtonFormField(
                          // hint: Text('Loại sự kiện'),
                          decoration: myInputDecoration('', label: 'Loại sự kiện', inputBorder: Colors.black26),
                          value: _currentEventType == null ? eventsProvider.eventTypeList[0].id : _currentEventType,
                          items: eventsProvider.eventTypeList.map<DropdownMenuItem<String>>((EventTypes type) {
                            return DropdownMenuItem(
                              child: Text(type.name),
                              value: type.id,
                            );
                          }).toList(),
                          onChanged: (value) {
                            print(value);
                            _handleChangeEventType(value);
                          },
                          onTap: () {
                            FocusManager.instance.primaryFocus.unfocus();
                          },
                        );
                      })),
                  _currentEventType == '2' || _currentEventType == '3'
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
                                return 'thời điểm không dược để trống';
                              }
                              return null;
                            },
                          ))
                      : Container(),
                  _currentEventType == '4'
                      ? Row(
                          children: [
                            Expanded(
                              child: Container(
                                  margin: EdgeInsets.symmetric(vertical: 10),
                                  padding: EdgeInsets.only(right: 5),
                                  child: DropdownButtonFormField(
                                    hint: Text('Vào ngày'),
                                    decoration: myInputDecoration('', inputBorder: Colors.black26),
                                    value: _currentValue2,
                                    items: _values2,
                                    onChanged: (value) {
                                      setState(() {
                                        _currentValue2 = value;
                                      });
                                    },
                                    validator: (String value) {
                                      if (value == null) {
                                        return 'Ngày không dược để trống';
                                      }
                                      if (_currentValue != null && !isValidMonthDay(int.parse(value), int.parse(_currentValue))) {
                                        return "Ngày, tháng không hợp lệ";
                                      }
                                      return null;
                                    },
                                  )),
                            ),
                            Expanded(
                              child: Container(
                                  margin: EdgeInsets.symmetric(vertical: 10),
                                  padding: EdgeInsets.only(left: 5),
                                  child: DropdownButtonFormField(
                                    hint: Text('Vào tháng'),
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
                                        return 'Tháng không dược để trống';
                                      }
                                      return null;
                                    },
                                  )),
                            ),
                          ],
                        )
                      : Container(),

                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    child: TextFormField(
                      controller: _startDatetimeController,
                      showCursor: true,
                      readOnly: true,
                      decoration: myInputDecoration('', label: 'Thời gian tạo', inputBorder: Colors.black26),
                      onTap: () {
                        _selectTime();
                      },
                      validator: (String value) {
                        return null;
                      },
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 10),
                    // padding: EdgeInsets.symmetric(horizontal: 10),
                    // decoration: BoxDecoration(borderRadius: BorderRadius.circular(10.0), border: Border.all(width: 1, color: Colors.black26)),
                    child: DropdownButtonFormField(
                      // hint: Text('Kết thúc'),
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
                          padding: const EdgeInsets.symmetric(vertical: 10),
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
                      child: Consumer<CatsProvider>(builder: (context, catsProvider, child) {
                        return DropdownButtonFormField(
                          hint: Text('Chọn hạng mục chi tiêu'),
                          decoration: InputDecoration(
                            enabledBorder: InputBorder.none,
                          ),
                          value: _currentCategory == null ? catsProvider.fullList[0].id : _currentCategory,
                          items: catsProvider.fullList.map<DropdownMenuItem<String>>((Categories cat) {
                            IconCustom selectedIcon =
                                _iconList.firstWhere((element) => element.id == cat.iconID, orElse: () => new IconCustom(id: '', name: '', color: '', backgroundColor: ''));

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
                          onChanged: _changeTxCat,
                          onTap: () {
                            FocusManager.instance.primaryFocus.unfocus();
                          },
                        );
                      })),
                  // Container(
                  //   margin: EdgeInsets.symmetric(vertical: 10),
                  //   child: TextFormField(
                  //     maxLines: 5,
                  //     maxLength: 500,
                  //     controller: _descriptionController,
                  //     decoration: myInputDecoration('Mô tả', inputBorder: Colors.black26),
                  //     validator: (String value) {
                  //       if (value.length > 500) {
                  //         return 'Mô tả không được quá 500 ký tự';
                  //       }
                  //       return null;
                  //     },
                  //   ),
                  // ),
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 10),
                    child: myFullWidthButton('Thêm sự kiện', backgroundColor: primary, action: () {
                      if (_formKey.currentState.validate()) {
                        showSnack(_scaffoldKey, 'Đang xử lý...');
                        _handleAddEvent();
                      }
                    }),
                  )
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

  void _selectTime() async {
    final TimeOfDay pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay(hour: _selectedStartDatetime.hour, minute: _selectedStartDatetime.minute),
        helpText: 'Chọn giờ xảy ra sự kiện',
        cancelText: 'Hủy',
        confirmText: 'Chọn');

    if (pickedTime != null) {
      DateTime result = new DateTime(_selectedStartDatetime.year, _selectedStartDatetime.month, _selectedStartDatetime.day, pickedTime.hour, pickedTime.minute);

      setState(() {
        _selectedStartDatetime = result;
      });
      _startDatetimeController.text = convertToHHMM(result.toString());
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

    String finalValue = _currentValue;
    if (_currentEventType == '4') {
      int month = _currentValue == null ? 0 : int.parse(_currentValue);
      int day = _currentValue2 == null ? 0 : int.parse(_currentValue2);
      finalValue = (day * 1000 + month).toString();
    }

    EventsProvider eventsProvider = Provider.of<EventsProvider>(context, listen: false);
    CatsProvider catsProvider = Provider.of<CatsProvider>(context, listen: false);
    final Map<String, dynamic> newEvent = {
      'Name': _nameController.text,
      'StartDate': DateTime.now().toUtc().toIso8601String(),
      'EndDate': _currentEndDateType == 'true' ? _selectedEndDatetime.toUtc().toIso8601String() : null,
      'Value': finalValue == null ? 0 : int.parse(finalValue),
      'ExpectingAmount': _currentTxType == 'Chi' ? price * -1 : price,
      'CategoryID': _currentCategory == null ? catsProvider.fullList[0].id : _currentCategory,
      'EventTypeID': _currentEventType == null ? eventsProvider.eventTypeList[0].id : _currentEventType,
      'Description': '', //_descriptionController.text,
      'StartTime': _selectedStartDatetime.toUtc().toIso8601String(),
    };
    print(newEvent);

    print(DateTime.parse(newEvent['StartTime']));
    showSnack(_scaffoldKey, 'Đang xử lý...');
    socket.emitWithAck('add_event', {'walletID': widget.walletID, 'newEvent': newEvent}, ack: () {
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, "Thêm thành công");
    });
  }
}
