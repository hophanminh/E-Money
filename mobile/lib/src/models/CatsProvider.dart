import 'dart:convert';
import 'dart:ffi';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart';

class CatsProvider extends ChangeNotifier {
  List<Categories> _fullList = [];
  List<Categories> _defaultList = [];
  List<Categories> _customList = [];
  String _searchString = "";
  Categories _selected;

  Future<bool> fetchData(Map<String, dynamic> body) async {
    List<Categories> fullList = [];
    for (int i = 0; i < body['fullList'].length; i++) {
      fullList.add(Categories.fromJson(body['fullList'][i]));
    }
    List<Categories> defaultList = [];
    for (int i = 0; i < body['defaultList'].length; i++) {
      defaultList.add(Categories.fromJson(body['defaultList'][i]));
    }
    List<Categories> customList = [];
    for (int i = 0; i < body['customList'].length; i++) {
      customList.add(Categories.fromJson(body['customList'][i]));
    }

    this.loadData(fullList, defaultList, customList);

    return true;
  }

  void loadData(List<Categories> fullList, List<Categories> defaultList, List<Categories> customList) async {
    this._fullList = fullList;
    this._defaultList = defaultList;
    this._customList = customList;
    if (this._selected != null) {
      try {
        Categories temp = fullList.firstWhere((cat) => cat.id == this.selected.id);
        this._selected = temp;
      } catch (error) {
        this._selected = null;
      }
    }
    notifyListeners();
  }

  Future<bool> changeSelected(Categories selected) async {
    this._selected = selected;
    notifyListeners();
    return true;
  }

  void changeSearchString(String searchString) {
    this._searchString = searchString;
    notifyListeners();
  }

  List<Categories> getDefaultFilteredList() {
    if (this._searchString != '') {
      return this.defaultList.where((i) => i.name.toLowerCase().contains(this._searchString.toLowerCase())).toList();
    } else {
      return this.defaultList;
    }
  }

  List<Categories> getCustomFilteredList() {
    if (this._searchString != '') {
      return this.customList.where((i) => i.name.toLowerCase().contains(this._searchString.toLowerCase())).toList();
    } else {
      return this.customList;
    }
  }

  Categories get selected => _selected;

  List<Categories> get customList => _customList;

  List<Categories> get defaultList => _defaultList;

  List<Categories> get fullList => _fullList;
}

class Categories {
  String id;
  String name;
  bool isDefault;
  String walletID;
  String iconID;

  Categories({this.id, this.name, this.isDefault, this.walletID, this.iconID});

  @override
  String toString() {
    return 'Categories{id: $id, name: $name, isDefault: $isDefault, walletID: $walletID, iconID: $iconID}';
  }

  factory Categories.fromJson(Map<String, dynamic> json) {
    return Categories(
      id: json['ID'] as String,
      name: json['Name'] as String,
      isDefault: json['IsDefault'] == 1 ? true : false,
      walletID: json['WalletID'] as String,
      iconID: (json['IconID'] as int).toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'ID': id,
        'Name': name,
        'IsDefault': isDefault,
        'WalletID': walletID,
        'IconID': iconID,
      };
}
