import 'dart:convert';
import 'dart:ffi';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';

class TeamsProvider extends ChangeNotifier {
  List<Teams> _teamList = [];
  Teams _selected;

  String _searchString = "";

  Future<bool> fetchData() async {
    Response res = await TeamService.instance.getTeamList();
    if (res == null || res.statusCode != 200) {
      return false;
    }
    Map<String, dynamic> body = jsonDecode(res.body);
    List<Teams> teamList = [];
    for (int i = 0; i < body['teams'].length; i++) {
      teamList.add(Teams.fromJson(body['teams'][i]));
    }

    this.loadData(teamList);
    return true;
  }

  void loadData(data) async {
    this._teamList = data;
    if (this._selected != null) {
      try {
        Teams temp = data.firstWhere((team) => team.id == this.selected.id);
        this._selected = temp;
      }
      catch (error) {
        this._selected = null;
      }

    }
    notifyListeners();
  }

  void changeSelected(Teams selected) {
    this._selected = selected;
    notifyListeners();
  }

  void changeSearchString(String searchString) {
    this._searchString = searchString;
    notifyListeners();
  }

  List<Teams> getFilterList() {
    if (this._searchString != '') {
      return this
          ._teamList
          .where((i) =>
              i.name.toLowerCase().contains(this._searchString.toLowerCase()))
          .toList();
    } else {
      return this._teamList;
    }
  }

  Teams findTeams(String id) {
    return this._teamList.firstWhere((i) => i.walletID == id, orElse: () => null);
  }

  Teams get selected => _selected;

  List<Teams> get teamList => _teamList;
}

class Teams {
  String id;
  String name;
  int currentUsers;
  int maxUsers;
  String description;
  String createdDate;
  String walletID;

  Teams(
      {this.id,
      this.name,
      this.currentUsers,
      this.maxUsers,
      this.description,
      this.createdDate,
      this.walletID});

  @override
  String toString() {
    return 'Users{id: $id, name: $name, currentUsers: $currentUsers, maxUsers: $maxUsers, description: $description, createdDate: $createdDate, walletID: $walletID}';
  }

  factory Teams.fromJson(Map<String, dynamic> json) {
    return Teams(
      id: json['ID'] as String,
      name: json['Name'] as String,
      currentUsers: json['CurrentUsers'] as int,
      maxUsers: json['MaxUsers'] as int,
      description: json['Description'] as String,
      createdDate: json['CreatedDate'] as String,
      walletID: json['WalletID'] as String,
    );
  }
}
