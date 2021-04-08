import 'package:flutter/material.dart';

const primary = Color(0xFF1DAF1A);
const secondary = Color(0xFFFDA92C);
const error = Colors.redAccent;

bool isEmailPattern(String token) {
  RegExp emailPattern = new RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
  return emailPattern.hasMatch(token);
}

void showSnack(GlobalKey<ScaffoldMessengerState> key, String title) {
  final snackbar = SnackBar(
    content: Container(
      height: 20,
      child: FittedBox(
        child: Text(title),
      ),
    ),
  );
  key.currentState.removeCurrentSnackBar();
  key.currentState.showSnackBar(snackbar);
}
