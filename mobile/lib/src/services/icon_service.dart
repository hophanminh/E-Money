import 'dart:async';
import 'dart:convert';
import 'package:async/async.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';

class IconService {

  // Singleton pattern
  static final IconService _iconService = new IconService._internal();
  IconService._internal();
  static IconService get instance => _iconService;

  // Members
  static List<IconCustom> _iconList;
  final _initIconList = AsyncMemoizer<List<IconCustom>>();

  Future<List<IconCustom>> get iconList async {
    if (_iconList != null)
      return _iconList;

    _iconList = await _initIconList.runOnce(() async {
      return await _initList();
    });

    return _iconList;
  }

  Future<List<IconCustom>> _initList() async {
    List<IconCustom> _iconList = [];
    List<dynamic> body = jsonDecode(await WalletService.instance.getListIcon());
    for (int i = 0; i < body.length; i++) {
      _iconList.add(IconCustom.fromJson(body[i]));
    }
    return _iconList;
  }

}

class IconCustom {
  String id;
  String name;
  String color;
  String backgroundColor;

  IconCustom(
      {this.id,
        this.name,
        this.color,
        this.backgroundColor});


  @override
  String toString() {
    return 'IconCustom{id: $id, name: $name, color: $color, backgroundColor: $backgroundColor}';
  }

  factory IconCustom.fromJson(Map<String, dynamic> json) {
    return IconCustom(
      id: (json['ID'] as int).toString(),
      name: json['Name'] as String,
      color: json['Color'] as String,
      backgroundColor: json['BackgroundColor'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'ID': id,
    'Name': name,
    'Color': color,
    'BackgroundColor': backgroundColor,
  };

}
