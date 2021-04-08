import 'package:flutter/material.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/services/secure_storage_service.dart';

const TextStyle myErrorTextStyle = TextStyle(fontWeight: FontWeight.bold, color: error, fontSize: 13);

InputDecoration myInputDecoration(String placeholder) => InputDecoration(
    hintText: placeholder,
    contentPadding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: primary, width: 1.0)),
    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: primary, width: 1.0)),
    errorBorder: OutlineInputBorder(borderSide: BorderSide(color: error, width: 1.0)),
    focusedErrorBorder: OutlineInputBorder(borderSide: BorderSide(color: error, width: 1.0)),
    filled: true,
    fillColor: Colors.white,
    errorStyle: myErrorTextStyle);

// BoxShadow myShadow() => BoxShadow(
//       color: Colors.black12,
//       blurRadius: 10.0, // soften the shadow
//       spreadRadius: -5.0, //extend the shadow
//       offset: Offset(
//         10.0, // Move to right 10  horizontally
//         5.0, // Move to bottom 5 Vertically
//       ),
//     );

AppBar mySimpleAppBar(String title) => AppBar(
      // app bar without 'action' property
      iconTheme: IconThemeData(color: Colors.white),
      title: Text(title, style: TextStyle(color: Colors.white)),
      backgroundColor: primary,
      centerTitle: true,
    );

Drawer mySideBar({BuildContext context, bool isChoosingPrivateWallet, Function callback}) => Drawer(
      child: ListView(
        padding: const EdgeInsets.all(0.0),
        children: <Widget>[
          DrawerHeader(
            // margin: EdgeInsets.zero,
            // padding: const EdgeInsets.all(0.0),
            decoration: BoxDecoration(
              color: primary,
              image: DecorationImage(image: AssetImage('assets/images/sidebar.png'), fit: BoxFit.fill, colorFilter: ColorFilter.mode(Colors.white10, BlendMode.darken)),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundImage: AssetImage('assets/images/default_avatar.png'),
                  radius: 35,
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: Text(
                      'Minh lạcvvvvvvvv vvvvvvvvvvvvvvvvvvv',
                      style: TextStyle(fontSize: 25, color: Colors.white),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ],
            ),
          ),
          _createDrawerItem(
              title: 'Thông tin cá nhân',
              icon: Icons.info_outline,
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/profile');
              }),
          Divider(
            thickness: 0.75,
          ),
          _createDrawerItem(
              title: 'Ví cá nhân',
              icon: Icons.account_balance_wallet_outlined,
              isChoosingPrivateWallet: isChoosingPrivateWallet,
              onTap: () {
                Navigator.pop(context);
                callback(true);
              }),
          _createDrawerItem(
              title: 'Ví nhóm',
              icon: Icons.group_outlined,
              isChoosingPrivateWallet: !isChoosingPrivateWallet,
              onTap: () {
                Navigator.pop(context);
                callback(false);
              }),
          Divider(
            thickness: 0.75,
          ),
          _createDrawerItem(
              title: 'Đăng xuất',
              icon: Icons.logout,
              onTap: () {
                SecureStorage.deleteAllSecureData();
                Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
              }),
        ],
      ),
    );

Widget _createDrawerItem({IconData icon, String title, Function onTap, bool isChoosingPrivateWallet}) {
  return ListTile(
    title: Row(
      children: <Widget>[
        Icon(icon),
        Padding(
          padding: EdgeInsets.only(left: 8.0),
          child: Text(title),
        ),
      ],
    ),
    selected: isChoosingPrivateWallet == true,
    selectedTileColor: Colors.black12,
    trailing: isChoosingPrivateWallet == true ? Icon(Icons.chevron_right_outlined) : null,
    onTap: () => onTap(),
  );
}
