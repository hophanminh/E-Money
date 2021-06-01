import 'dart:convert';
import 'dart:ffi';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';

class WalletsProvider extends ChangeNotifier {
  List<Transactions> _txList = [];
  Transactions _selected;
  int _spent = 0;
  int _receive = 0;
  int _total = 0;

  String _searchString = "";

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
      }
      catch (error) {
        this._selected = null;
      }

    }
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

  List<Transactions> getFilterList() {
    if (this._searchString != '') {
      return this
          ._txList
          .where((i) =>
              i.description.toLowerCase().contains(this._searchString.toLowerCase()))
          .toList();
    } else {
      return this._txList;
    }
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
