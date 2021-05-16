import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/services/secure_storage_service.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

const API_URL = 'http://' + Properties.API_LOCAL;
IO.Socket socket = null;

void startSocket() {
  // print( await SecureStorage.readSecureData('jwtToken'));
  socket = IO.io(API_URL);
  print('2');
  socket.onConnect((_) {
    print('connect');
  });

  socket.on('connect_error', (err) => print(err));
}

Future<IO.Socket> getSocket() async {
  print('dds');
  if (socket == null && await SecureStorage.readSecureData('jwtToken') != null) {
    print('chưa có');
    startSocket();
  }
  print('xog');
  return socket;
}
