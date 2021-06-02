import 'dart:convert';
import 'dart:ffi';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart';

class EventsProvider extends ChangeNotifier {
  List<Events> _eventList = [];
  List<EventTypes> _eventTypeList = [];

  Events _selected;

  Future<bool> fetchData(Map<String, dynamic> body) async {
    List<Events> eventList = [];
    for (int i = 0; i < body['eventList'].length; i++) {
      eventList.add(Events.fromJson(body['eventList'][i]));
    }
    eventList.sort((a, b) => b.startDate.compareTo(a.startDate));

    this.loadData(eventList);

    return true;
  }

  void loadData(List<Events> eventList) async {
    this._eventList = eventList;

    if (this._selected != null) {
      try {
        Events temp = _eventList.firstWhere((event) => event.id == this.selected.id);
        this._selected = temp;
      }
      catch (error) {
        this._selected = null;
      }

    }
    notifyListeners();
  }

  Future<bool> fetchType(Map<String, dynamic> body) async {
    List<EventTypes> eventTypeList = [];
    for (int i = 0; i < body['eventTypeList'].length; i++) {
      eventTypeList.add(EventTypes.fromJson(body['eventTypeList'][i]));
    }
    this.loadType(eventTypeList);

    return true;
  }
  void loadType(List<EventTypes> eventTypeList) async {
    this._eventTypeList = eventTypeList;

    notifyListeners();
  }

  Future<bool> changeSelected(Events selected) async {
    this._selected = selected;
    notifyListeners();
    return true;
  }

  Events get selected => _selected;

  List<EventTypes> get eventTypeList => _eventTypeList;

  List<Events> get eventList => _eventList;
}

class Events {
  String id;
  String name;
  String startDate;
  String nextDate;
  String endDate;
  bool status;
  int value;
  double expectingAmount;
  String description;
  String walletID;
  String categoryID;
  String eventTypeID;
  String typeName;
  String categoryName;
  String iconID;
  double totalAmount;

  Events(
      {this.id,
        this.name,
        this.startDate,
        this.nextDate,
        this.endDate,
        this.status,
        this.value,
        this.expectingAmount,
        this.description,
        this.walletID,
        this.categoryID,
        this.eventTypeID,
        this.typeName,
        this.categoryName,
        this.iconID,
        this.totalAmount});


  @override
  String toString() {
    return 'Events{id: $id, name: $name, startDate: $startDate, nextDate: $nextDate, endDate: $endDate, status: $status, value: $value, expectingAmount: $expectingAmount, description: $description, walletID: $walletID, categoryID: $categoryID, eventTypeID: $eventTypeID, typeName: $typeName, categoryName: $categoryName, iconID: $iconID, totalAmount: $totalAmount}';
  }


  factory Events.fromJson(Map<String, dynamic> json) {
    return Events(
      id: json['ID'] as String,
      name: json['Name'] as String,
      startDate: json['StartDate'] as String,
      nextDate: json['NextDate'] as String,
      endDate: json['EndDate'] as String,
      status: json['Status'] == 1 ? true: false,
      value: json['Value'] as int,
      expectingAmount: json['ExpectingAmount'].toDouble(),
      description: json['Description'] as String,
      walletID: json['WalletID'] as String,
      categoryID: json['CategoryID'] as String,
      eventTypeID: json['EventTypeID'] as String,
      typeName: json['TypeName'] as String,
      categoryName: json['CategoryName'] as String,
      iconID: json['IconID'] as String,
      totalAmount: json['TotalAmount'] != null ? json['TotalAmount'].toDouble() : 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'ID': id,
    'Name': name,
    'StartDate': startDate,
    'NextDate': nextDate,
    'EndDate': endDate,
    'Status': status,
    'Value': value,
    'ExpectingAmount': expectingAmount,
    'Description': description,
    'WalletID': walletID,
    'CategoryID': categoryID,
    'EventTypeID': eventTypeID,
    'TypeName': typeName,
    'CategoryName': categoryName,
    'IconID': iconID,
    'TotalAmount': totalAmount,};
}

class EventTypes {
  String id;
  String name;

  EventTypes(
      {this.id,
        this.name});


  @override
  String toString() {
    return 'Events{id: $id, name: $name}';
  }


  factory EventTypes.fromJson(Map<String, dynamic> json) {
    return EventTypes(
      id: json['ID'] as String,
      name: json['Name'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'ID': id,
    'Name': name};
}