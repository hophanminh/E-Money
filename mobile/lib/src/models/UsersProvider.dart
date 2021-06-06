import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:flutter/foundation.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/auth_service.dart';

class UsersProvider extends ChangeNotifier {
  bool _isLoggedIn = false;
  Users _info;
  String _token = "";
  String _userId = "";
  bool _isLoading = false;

  Future<Users> fetchData() async {
    Response res = await AuthService.instance.fetchInfo();
    if (res == null || res.statusCode != 200) {
      throw Exception("Không lấy được dữ liệu từ server");
    }
    Map<String, dynamic> body = jsonDecode(res.body);
    this.loadData(body['user'], body['token']);
    return new Users.fromJson(body['user']);
  }

  void loadData(data, token) async {
    this._info = new Users.fromJson(data);
    this._token = token;
    this._userId = data["ID"];
    this._isLoggedIn = true;
    notifyListeners();
  }

  void updateImage(image) async {
    this._info.avatarURL = image;
    notifyListeners();
  }

  void updateInfo(Users newInfo) {
    this._info = newInfo;
    notifyListeners();
  }

  Users get info => _info;

  set info(Users newInfo) {
    _info = newInfo;
    notifyListeners();
  }
}

class Users {
  String id;
  String name;
  String username;
  String email;
  String dateOfBirth;
  String avatarURL;
  String activatedDate;
  String walletID;

  Users(
      {this.id,
      this.name,
      this.username,
      this.email,
      this.dateOfBirth,
      this.avatarURL,
      this.activatedDate,
      this.walletID});

  factory Users.fromJson(Map<String, dynamic> json) {
    return Users(
      id: json['ID'] as String,
      name: json['Name'] as String,
      username: json['Username'] as String,
      email: json['Email'] as String,
      dateOfBirth: json['DateOfBirth'] as String,
      avatarURL: json['AvatarURL'] as String,
      activatedDate: json['ActivatedDate'] as String,
      walletID: json['WalletID'] as String,
    );
  }

  @override
  String toString() {
    return 'Users{id: $id, name: $name, username: $username, email: $email, dateOfBirth: $dateOfBirth, avatarURL: $avatarURL, activatedDate: $activatedDate, walletID: $walletID}';
  }
}
