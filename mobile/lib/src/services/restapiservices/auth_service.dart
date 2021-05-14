import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/secure_storage_service.dart';

class AuthService {
  static const String _baseURL = Properties.API_LOCAL;

  // if using Android emulator, the baseURL must be 10.0.2.2:<port>
  // if using real device, the baseURL depends on the IPv4 of computer running the node.js server: 192.168.XX.XX:<port>
  // nhớ tắt tường lửa của laptop !!

  static final AuthService instance = AuthService._internal(); // singleton for this class

  factory AuthService() => instance;

  AuthService._internal();

  Future<http.Response> signin(String username, String password) async {
    return await http.post(Uri.http(_baseURL, '/signin'),
        headers: {
          HttpHeaders.contentTypeHeader: 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String>{'Username': username, 'Password': password}));
  }

  Future<http.Response> fetchInfo() async {
    String userID = await SecureStorage.readSecureData('userID');

    if (userID == null) {
      return null;
    }

    String token = await SecureStorage.readSecureData('jwtToken');
    return await http
        .get(Uri.http(_baseURL, '/users/$userID'), headers: {HttpHeaders.authorizationHeader: "Bearer $token", HttpHeaders.contentTypeHeader: 'application/json; charset=UTF-8'});
  }
}
