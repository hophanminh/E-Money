import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/secure_storage_service.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

const API_URL = 'http://' + Properties.API_LOCAL;
IO.Socket socket = null;

// startSocket() async {
//   print('Starting socket client');
//   String jwtToken = await SecureStorage.readSecureData('jwtToken');
//   socket = IO.io(API_URL, <String, dynamic>{
//     'transports': ['websocket'],
//     'query': {'token': jwtToken}
//   });
//   socket.onConnect((_) {
//     print('connected: ' + socket.id);
//   });
//
//   socket.on('connect_error', (err) => print(err));
// }

Future<IO.Socket> getSocket() async {
  String jwtToken = await SecureStorage.readSecureData('jwtToken');
  if (socket == null && jwtToken != null) {
    print('starting socket client');
    socket = IO.io(API_URL, <String, dynamic>{
      'transports': ['websocket'],
      'query': {'token': jwtToken}
    });
    socket.onConnect((_) {
      print('connected: ' + socket.id);
    });

    socket.on('connect_error', (err) => print(err));
  }
  print(socket.id);
  return socket;
}
