import 'dart:convert';
import 'dart:ffi';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';

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
