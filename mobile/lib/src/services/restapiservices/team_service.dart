import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/secure_storage_service.dart';

class TeamService {
  static const String _baseURL = Properties.API_LOCAL;

  static final TeamService instance = TeamService._internal(); // singleton for this class

  factory TeamService() => instance;

  TeamService._internal();

  Future<http.Response> getTeamList() async {
    String userID = await SecureStorage.readSecureData('userID');

    if (userID == null) {
      return null;
    }

    String token = await SecureStorage.readSecureData('jwtToken');
    return await http
        .get(Uri.http(_baseURL, '/teams/$userID'), headers: {HttpHeaders.authorizationHeader: "Bearer $token", HttpHeaders.contentTypeHeader: 'application/json; charset=UTF-8'});
  }

}
