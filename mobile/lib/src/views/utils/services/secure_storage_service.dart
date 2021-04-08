// plug-in: flutter_secure_storage: ^4.1.0

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
class SecureStorage {
  static final _storage = new FlutterSecureStorage();

  static Future writeSecureData(String key, String value)  async {
    var writeData = await _storage.write(key: key, value: value);
    // print(_storage.readAll().then((value) => print(value.length)));
    return writeData;
  }
  static Future readSecureData(String key) async {
    var readData = await _storage.read(key: key);
    return readData;
  }
  static Future deleteSecureData(String key) async{
    var deleteData = await _storage.delete(key: key);
    return deleteData;
  }

  static Future deleteAllSecureData() async {
    var result = await _storage.deleteAll();
    // print(_storage.readAll().then((value) => print(value.length)));
    return result;
  }
}