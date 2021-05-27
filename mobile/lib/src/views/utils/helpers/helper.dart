import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

const primary = Color(0xFF1DAF1A);
const secondary = Color(0xFFFDA92C);
const error = Colors.redAccent;
const warning = error;

Map<String, dynamic> parseMap(dynamic data) => new Map<String, dynamic>.from(data);

final double max = 999999999;
var formatter = new NumberFormat.simpleCurrency(locale: 'vi');
var _formatter = new NumberFormat.currency(locale: 'vi', symbol: '');

String formatMoneyWithSymbol(dynamic amount) => amount != null ? (amount > max ? _formatter.format(max) : formatter.format(amount)) : "";

String formatMoneyWithoutSymbol(dynamic amount) => amount != null ? (amount > max ? _formatter.format(max) : _formatter.format(amount).replaceAll(new RegExp("\\s+"), '')) : ""; // format xong có dấu cách ở cuối nên replace để bỏ

bool isEmailPattern(String token) {
  RegExp emailPattern = new RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
  return emailPattern.hasMatch(token);
}

bool isBlankString(String token) {
  return token.trim().length == 0;
}

//work for scaffoldmessenger
void showSnack(GlobalKey<ScaffoldMessengerState> key, String title, {int duration = 3, SnackBarAction action}) {
  final snackbar = SnackBar(
    content: Container(
      height: 20,
      child: FittedBox(
        child: Text(title),
      ),
    ),
    duration: duration < 0 ? Duration(days: 365) /*look like infinite snackbar*/ : Duration(seconds: duration),
    action: action,
  );
  key.currentState.removeCurrentSnackBar();
  key.currentState.showSnackBar(snackbar);
}

// work for non-scaffoldmessenger
void showSnackV2(BuildContext context, String title, {int duration = 3, SnackBarAction action}) {
  ScaffoldMessenger.of(context).removeCurrentSnackBar();
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
    content: Container(
      height: 20,
      child: FittedBox(
        child: Text(title),
      ),
    ),
    duration: duration < 0 ? Duration(days: 365) /*look like infinite snackbar*/ : Duration(seconds: duration),
    action: action,
  ));
}

closeSnackAction(GlobalKey<ScaffoldMessengerState> key) => SnackBarAction(
    label: 'Đóng',
    onPressed: () {
      key.currentState.removeCurrentSnackBar();
    });

closeSnackActionV2(BuildContext context, String label, Function action) => SnackBarAction(
    label: label,
    onPressed: () {
      action();
    });

/// Examples of accepted strings:
///
/// * `"2012-02-27"`
/// * `"2012-02-27 13:27:00"`
/// * `"2012-02-27 13:27:00.123456789z"`
/// * `"2012-02-27 13:27:00,123456789z"`
/// * `"20120227 13:27:00"`
/// * `"20120227T132700"`
/// * `"20120227"`
/// * `"+20120227"`
/// * `"2012-02-27T14Z"`
/// * `"2012-02-27T14+00:00"`
/// * `"-123450101 00:00:00 Z"`: in the year -12345.
/// * `"2002-02-27T14:00:00-0500"`: Same as `"2002-02-27T19:00:00Z"`
String convertToDDMMYYYY(String input) {
  try {
    DateTime tempDate = DateTime.parse(input);
    return DateFormat('dd/MM/yyyy').format(tempDate.toLocal());
  } catch (error) {
    return "";
  }
}

String convertToDDMMYYYYHHMM(String input) {
  try {
    DateTime tempDate = DateTime.parse(input);
    return DateFormat('dd/MM/yyyy - HH:mm').format(tempDate.toLocal());
  } catch (error) {
    return "";
  }
}

String getThisMonth() => DateFormat('MM/yyyy').format(new DateTime.now());

String convertRegularDateToNormalDate(String input) {
  try {
    DateTime tempDate = new DateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse(input);
    return DateFormat('dd/MM/yyyy').format(tempDate);
  } catch (error) {
    return "";
  }
}

DateTime parseInput(String input) {
  try {
    DateTime tempDate = DateTime.parse(input);
    return tempDate;
  } catch (error) {
    return null;
  }
}

String timeRemaining(String input) {
  DateTime temp = parseInput(input);

  if(input == null) {
    return "-1";
  }

  Duration remaining= temp.difference(DateTime.now());
  int days = remaining.inDays;
  int hours = remaining.inHours;
  return days > 0 ? '${days} ngày' : '${hours} giờ';
}


final everyWeek = [
  'thứ 2',
  'thứ 3',
  'thứ 4',
  'thứ 5',
  'thứ 6',
  'thứ 7',
  'chủ nhật',
];

getValueOfEventType(String eventType) {
  List<String> tempList = [];
  if (eventType == "1") {
    tempList = [];
  }
  if (eventType == "2") {
    tempList = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  }
  if (eventType == "3") {
    for (int i = 0; i < 31; i++) {
      tempList.add("Ngày ${i+1}");
    }
  }
  if (eventType == "4") {
    for (int i = 0; i < 12; i++) {
      tempList.add("Tháng ${i + 1}");
    }
  }
  return tempList;
}