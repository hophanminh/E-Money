import 'package:mobile/src/config/config.dart';

Uri createURI(String baseURL, String path, [Map<String, dynamic> queryParams]) {
  if (Properties.IS_HTTPS) {
    return Uri.https(baseURL, path, queryParams);
  }

  return Uri.http(baseURL, path, queryParams);
}
