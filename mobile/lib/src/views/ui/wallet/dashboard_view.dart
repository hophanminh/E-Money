import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/src/config/config.dart';
import 'package:mobile/src/models/NotificationProvider.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/profile/change_password.dart';
import 'package:mobile/src/views/ui/profile/profile_view.dart';
import 'package:mobile/src/views/ui/team/team_list.dart';
import 'package:mobile/src/views/ui/wallet/notification/notification_view.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/private_wallet.dart';
import 'package:mobile/src/views/ui/wallet/team_wallet/team_wallet.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:socket_io_client/socket_io_client.dart';

class Dashboard extends StatefulWidget {
  final Map<String, dynamic> user;

  const Dashboard({this.user});

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  String mainRouteName = 'privateWallet';
  Socket _socket;

  @override
  void initState() {
    super.initState();
    _initPage();
  }

  _initPage() async {
    UsersProvider usersProvider = Provider.of<UsersProvider>(context, listen: false);
    NotificationProvider notificationProvider = Provider.of<NotificationProvider>(context, listen: false);
    final userID = usersProvider.info.id;

    _socket = await getSocket();

    _socket.emitWithAck('get_notification', {'userID': userID, 'limit': Properties.AMOUNT_TO_LOAD_PER_TIME}, ack: (data) {
      notificationProvider.fetchData(data);
    });

    _socket.on('new_notification_added_$userID', (data) {
      notificationProvider.fetchData(data);
    });
  }

  void setMainRoute(String name) {
    setState(() {
      mainRouteName = name;
    });
  }

  // confirm exit app or not
  Future<bool> _onWillPop() async {
    return (await showDialog(
          context: context,
          builder: (context) => new AlertDialog(
            title: new Text('Xác nhận'),
            content: new Text('Bạn có chắc chắn muốn thoát khỏi ứng dụng?'),
            actions: <Widget>[
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: new Text('Hủy'),
              ),
              TextButton(
                onPressed: () => Navigator.of(context).pop(true),
                child: new Text('Xác nhận'),
              ),
            ],
          ),
        )) ??
        false;
  }

  sidebar(UsersProvider usersProvider) =>
      mySideBar(context: context, name: usersProvider.info.name, avatarURL: usersProvider.info.avatarURL, setMainRoute: setMainRoute, mainRouteName: mainRouteName);

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(statusBarColor: Colors.transparent));
    // Drawer sideBar = ;

    return WillPopScope(
        onWillPop: _onWillPop,
        child: Consumer<UsersProvider>(builder: (context, usersProvider, child) {
          return ScaffoldMessenger(child: createDashboardPage(sidebar(usersProvider)));
        }));
  }

  Widget createDashboardPage(sidebar) {
    if (mainRouteName == 'privateWallet') {
      return IndividualWallet(sidebar: sidebar);
    } else if (mainRouteName == 'teamList') {
      return TeamList(sidebar: sidebar);
    } else if (mainRouteName == 'notifications') {
      return NotificationsPage(sidebar: sidebar);
    } else if (mainRouteName == 'profile') {
      return ProfilePage(sidebar: sidebar);
    } else if (mainRouteName == 'changepassword') {
      return ChangePasswordPage(sidebar: sidebar);
    }
  }
}
