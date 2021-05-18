import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/secure_storage_service.dart';

class UserService {
  static const String _baseURL = Properties.API_LOCAL;

  static final UserService instance = UserService._internal(); // singleton for this class

  factory UserService() => instance;

  UserService._internal();

  Future<http.Response> changePassword(String currentPassword, String newPassword) async {
    String userID = await SecureStorage.readSecureData('userID');
    String token = await SecureStorage.readSecureData('jwtToken');

    return await http.patch(Uri.http(_baseURL, '/users/$userID/password'),
        headers: {HttpHeaders.contentTypeHeader: 'application/json; charset=UTF-8', HttpHeaders.authorizationHeader: 'Bearer $token'},
        body: jsonEncode(<String, String>{'CurrentPassword': currentPassword, 'NewPassword': newPassword}));
  }

  Future<http.Response> changeInfo(String name, String email, String dob) async {
    String userID = await SecureStorage.readSecureData('userID');
    String token = await SecureStorage.readSecureData('jwtToken');

    return await http.patch(Uri.http(_baseURL, '/users/$userID/info'),
        headers: {HttpHeaders.contentTypeHeader: 'application/json; charset=UTF-8', HttpHeaders.authorizationHeader: 'Bearer $token'},
        body: jsonEncode(<String, String>{'Name': name, 'Email': email, 'DateOfBirth': dob}));
  }

  Future<http.StreamedResponse> changeAvatar(File image) async {
    String userID = await SecureStorage.readSecureData('userID');
    String token = await SecureStorage.readSecureData('jwtToken');

    var stream = image.readAsBytesSync();
    var req = new http.MultipartRequest("PATCH", Uri.http(_baseURL, 'users/$userID/avatar'));
    var multipartFile = http.MultipartFile.fromBytes('avatar', stream, filename: image.path.split("/").last);
    req.headers.addAll({HttpHeaders.authorizationHeader: 'Bearer $token'});
    req.files.add(multipartFile);
    return await req.send();
  }
}
