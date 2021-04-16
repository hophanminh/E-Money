import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

const primary = Color(0xFF1DAF1A);
const secondary = Color(0xFFFDA92C);
const error = Colors.redAccent;
const warning = error;

bool isEmailPattern(String token) {
  RegExp emailPattern = new RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
  return emailPattern.hasMatch(token);
}

void showSnack(GlobalKey<ScaffoldMessengerState> key, String title, {int duration = 3}) {
  final snackbar = SnackBar(
    content: Container(
      height: 20,
      child: FittedBox(
        child: Text(title),
      ),
    ),
    duration: duration < 0 ? Duration(days: 365) /*look like infinite snackbar*/ : Duration(seconds: duration),
  );
  key.currentState.removeCurrentSnackBar();
  key.currentState.showSnackBar(snackbar);
}

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

String convertRegularDateToNormalDate(String input) {
  try {
    DateTime tempDate = new DateFormat("yyyy-MM-dd HH:mm:ss.SSS").parse(input);
    return DateFormat('dd/MM/yyyy').format(tempDate);
  } catch (error) {
    return "";
  }
}
