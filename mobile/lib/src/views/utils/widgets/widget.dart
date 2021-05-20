import 'package:flutter/material.dart';
import 'package:mobile/src/services/secure_storage_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';

const TextStyle myErrorTextStyle = TextStyle(fontWeight: FontWeight.bold, color: error, fontSize: 13);

Align myLabelText(String title, {AlignmentGeometry position = Alignment.centerLeft, double fontSize = 16.0}) => Align(
      alignment: position,
      child: Text(
        title,
        style: TextStyle(fontWeight: FontWeight.bold, fontSize: fontSize),
      ),
    );

InputDecoration myInputDecoration(String placeholder, {Color inputBorder = primary}) => InputDecoration(
      hintText: placeholder,
      contentPadding: EdgeInsets.symmetric(vertical: 10.0, horizontal: 10.0),
      focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: inputBorder, width: 1.0), borderRadius: BorderRadius.circular(12)),
      enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: inputBorder, width: 1.0), borderRadius: BorderRadius.circular(12)),
      errorBorder: OutlineInputBorder(borderSide: BorderSide(color: error, width: 1.0), borderRadius: BorderRadius.circular(12)),
      focusedErrorBorder: OutlineInputBorder(borderSide: BorderSide(color: error, width: 1.0), borderRadius: BorderRadius.circular(12)),
      filled: true,
      fillColor: Colors.white,
      errorStyle: myErrorTextStyle,
      // border: OutlineInputBorder(
      //   borderRadius: BorderRadius.circular(200),
      // ),
    );

AppBar mySimpleAppBar(String title) => AppBar(
      // app bar without 'action' property
      iconTheme: IconThemeData(color: Colors.white),
      title: Text(title, style: TextStyle(color: Colors.white)),
      backgroundColor: primary,
      centerTitle: true,
    );

Drawer mySideBar({BuildContext context, @required bool isChoosingPrivateWallet, String avatarURL, @required String name, Function switchWalletMode}) => Drawer(
      child: Column(
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
                myCircleAvatar(avatarURL, 35),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(10.0),
                    child: Text(
                      name,
                      style: TextStyle(fontSize: 25, color: Colors.white),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _createDrawerItem(
                    title: 'Thông tin cá nhân',
                    icon: Icons.info_outline,
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(context, '/profile');
                    }),
                _createDrawerItem(
                    title: 'Đổi mật khẩu',
                    icon: Icons.lock,
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(context, '/changepassword');
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
                      switchWalletMode(true);
                    }),
                _createDrawerItem(
                    title: 'Ví nhóm',
                    icon: Icons.group_outlined,
                    isChoosingPrivateWallet: !isChoosingPrivateWallet,
                    onTap: () {
                      Navigator.pop(context);
                      switchWalletMode(false);
                    }),
              ],
            ),
          ),
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

Widget _createDrawerItem({IconData icon, String title, Function onTap, bool isChoosingPrivateWallet}) => ListTile(
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

Align myAlignedButton(
  String text, {
  Function action,
  AlignmentGeometry alignment = Alignment.center,
  Color backgroundColor = primary,
  Color textColor = Colors.white,
  double fontSize = 17.0,
  BorderSide borderSide,
  EdgeInsetsGeometry padding = const EdgeInsets.symmetric(horizontal: 40, vertical: 10),
}) =>
    Align(
      alignment: alignment,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(primary: backgroundColor, padding: padding, side: borderSide, textStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: fontSize)),
        onPressed: action, // != null ? action : () {},
        child: Text(
          text,
          style: TextStyle(color: textColor),
        ),
      ),
    );

ElevatedButton myFullWidthButton(
    String text, {
      Function action,
      AlignmentGeometry alignment = Alignment.center,
      Color backgroundColor = primary,
      Color textColor = Colors.white,
      double fontSize = 17.0,
      BorderSide borderSide,
      EdgeInsetsGeometry padding = const EdgeInsets.symmetric(horizontal: 40, vertical: 10),
    }) =>
    ElevatedButton(
      style: ElevatedButton.styleFrom(primary: backgroundColor, padding: padding, side: borderSide, textStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: fontSize)),
      onPressed: action, // != null ? action : () {},
      child: Text(
        text,
        style: TextStyle(color: textColor),
      ),
    );

Widget myCircleAvatar(String avatarURL, double radius, {Key key}) => Container(
      key: key,
      decoration: new BoxDecoration(
        shape: BoxShape.circle,
        border: new Border.all(
          color: Colors.white60,
          width: 4.0,
        ),
      ),
      child: CircleAvatar(
        backgroundImage: avatarURL == null ? AssetImage('assets/images/default_avatar.png') : NetworkImage(avatarURL),
        radius: radius,
      ),
    );
