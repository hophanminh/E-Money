import 'dart:convert';
import 'dart:ffi';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/CatsProvider.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/private_wallet.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';

enum FilterType { all, category, date }

class WalletsProvider extends ChangeNotifier {
  List<Transactions> _txList = [];
  Transactions _selected;
  int _spent = 0;
  int _receive = 0;
  int _total = 0;

  String _searchString = "";
  String _searchMonth = "";
  String _searchYear = "";

  Future<bool> fetchData(Map<String, dynamic> body) async {
    List<Transactions> walletList = [];
    for (int i = 0; i < body['transactionList'].length; i++) {
      walletList.add(Transactions.fromJson(body['transactionList'][i]));
    }
    this.loadData(walletList);
    this._spent = body['spend'];
    this._receive = body['receive'];
    this._total = body['total'];

    return true;
  }

  void loadData(data) async {
    this._txList = data;
    if (this._selected != null) {
      try {
        Transactions temp = data.firstWhere((wallet) => wallet.id == this.selected.id);
        this._selected = temp;
      } catch (error) {
        this._selected = null;
      }
    }
    notifyListeners();
  }

  void updateTxCatAfterUpdateCat(List<dynamic> fullList) {
    List<Transactions> copyTxs = List.from(this.txList);

    for (int i = 0; i < copyTxs.length; i++) {
      List<dynamic> cat = fullList.where((cat) => cat['ID'] == copyTxs[i].catID).toList();
      if (cat.isNotEmpty) {
        copyTxs[i].iconID = cat.first['IconID'];
        copyTxs[i].categoryName = cat.first['Name'];
      } else {
        List<dynamic> cat = fullList.where((cat) => cat['Name'] == "Khác").toList();
        copyTxs[i].iconID = cat.first['IconID'];
        copyTxs[i].categoryName = cat.first['Name'];
        copyTxs[i].catID = cat.first['ID'];
      }
    }
    this._txList = copyTxs;
    notifyListeners();
  }

  Future<bool> changeSelected(Transactions selected) async {
    this._selected = selected;
    notifyListeners();
    return true;
  }

  void changeSearchString(String searchString) {
    this._searchString = searchString;
    notifyListeners();
  }

  void changeSearchMonth(String month) {
    this._searchMonth = month;
    notifyListeners();
  }

  void changeSearchYear(String year) {
    this._searchYear = year;
    notifyListeners();
  }

  List<Transactions> getFilterList(FilterType type) {
    switch (type) {
      case FilterType.all:
        {
          return this._txList;
        }
      case FilterType.category:
        {
          String searchStr = this._searchString.toLowerCase();
          if (searchStr != '') {
            return this._txList.where((i) => i.categoryName.toLowerCase().contains(searchStr) || i.description.toLowerCase().contains(searchStr)).toList();
          }
          return this._txList;
        }
      case FilterType.date:
        {
          if (_searchYear.isEmpty && _searchMonth.isEmpty) {
            return this.txList;
          }

          List<Transactions> result = [];

          if (_searchYear.isNotEmpty) {
            int _year = int.parse(this._searchYear);
            result.addAll(this.txList.where((element) => parseInput(element.time).year == _year).toList());
          }

          if (_searchMonth.isNotEmpty) {
            int _month = int.parse(this._searchMonth);
            result = result.where((element) => parseInput(element.time).month == _month).toList();
          }

          return result;
        }
    }
  }

  Transactions findTransaction(String id) {
    return this._txList.firstWhere((i) => i.id == id, orElse: () => null);
  }

  Transactions get selected => _selected;

  List<Transactions> get txList => _txList;

  String get searchString => _searchString;

  int get total => _total;

  int get receive => _receive;

  int get spent => _spent;
}

class Transactions {
  String id;
  String description;
  double price;
  String time;
  String timeModified;
  String catID;
  String iconID;
  String categoryName;
  String eventID;
  String eventName;
  String userName;
  String userID;
  int editNumber;

  Transactions(
      {this.id,
      this.description,
      this.price,
      this.time,
      this.timeModified,
      this.catID,
      this.iconID,
      this.categoryName,
      this.eventID,
      this.eventName,
      this.userName,
      this.userID,
      this.editNumber});

  @override
  String toString() {
    return 'Transactions{id: $id, description: $description, price: $price, time: $time, timeModified: $timeModified, catID: $catID, iconID: $iconID, categoryName: $categoryName, eventID: $eventID, eventName: $eventName, userName: $userName, editNumber: $editNumber}';
  }

  factory Transactions.fromJson(Map<String, dynamic> json) {
    return Transactions(
      id: json['id'] as String,
      description: json['description'] as String,
      price: json['price'].toDouble(),
      time: json['time'] as String,
      timeModified: json['timeModified'] as String,
      catID: json['catID'] as String,
      iconID: json['IconID'] as String,
      categoryName: json['categoryName'] as String,
      eventID: json['eventID'] as String,
      eventName: json['eventName'] as String,
      userName: json['userName'] as String,
      userID: json['userID'] as String,
      editNumber: json['editNumber'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'description': description,
        'price': price,
        'time': time,
        'timeModified': timeModified,
        'catID': catID,
        'IconID': iconID,
        'categoryName': categoryName,
        'eventID': eventID,
        'eventName': eventName,
        'userName': userName,
        'editNumber': editNumber,
      };
}
