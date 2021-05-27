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

  Future<http.Response> addTeam(String name, String max, String description) async {
    String userID = await SecureStorage.readSecureData('userID');
    String token = await SecureStorage.readSecureData('jwtToken');

    return await http.post(Uri.http(_baseURL, '/teams/$userID'),
        headers: {HttpHeaders.contentTypeHeader: 'application/json; charset=UTF-8', HttpHeaders.authorizationHeader: 'Bearer $token'},
        body: jsonEncode(<String, String>{'Name': name, 'MaxUsers': max, 'Description': description}));
  }

  Future<http.Response> editTeam(String name, String max, String description, String teamID) async {
    String userID = await SecureStorage.readSecureData('userID');
    String token = await SecureStorage.readSecureData('jwtToken');

    return await http.put(Uri.http(_baseURL, '/teams/details/$teamID'),
        headers: {HttpHeaders.contentTypeHeader: 'application/json; charset=UTF-8', HttpHeaders.authorizationHeader: 'Bearer $token'},
        body: jsonEncode(<String, String>{'Name': name, 'MaxUsers': max, 'Description': description, 'UserID': userID}));
  }

  Future<http.Response> joinTeam(String id) async {
    String userID = await SecureStorage.readSecureData('userID');
    String token = await SecureStorage.readSecureData('jwtToken');

    return await http.post(Uri.http(_baseURL, '/teams/join/$userID'),
        headers: {HttpHeaders.contentTypeHeader: 'application/json; charset=UTF-8', HttpHeaders.authorizationHeader: 'Bearer $token'},
        body: jsonEncode(<String, String>{'teamID': id}));
  }

}
