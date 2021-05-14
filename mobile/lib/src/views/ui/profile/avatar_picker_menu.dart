import 'package:flutter/material.dart';

Widget createBottomMenu(BuildContext context, Function imageFromGallery, Function imageFromCamera) {
  return Align(
    alignment: Alignment.bottomCenter,
    child: Material(
      elevation: 3,
      borderRadius: BorderRadius.only(topLeft: Radius.circular(15.0), topRight: Radius.circular(15)),
      color: Colors.white,
      child: ListView(
        shrinkWrap: true, // make container height fit to listview actual height
        padding: EdgeInsets.only(top:10),
        children: [
          _createListItem(
              icon: Icons.image_search_outlined,
              title: 'Chọn từ thư viện ảnh',
              onTap: () {
                imageFromGallery();
                Navigator.of(context).pop();
              }),
          Divider(thickness: 0.5),
          _createListItem(
              icon: Icons.add_a_photo_outlined,
              title: 'Chụp một ảnh mới',
              onTap: () {
                imageFromCamera();
                Navigator.of(context).pop();
              }),
          Padding(padding: EdgeInsets.only(bottom: 10))
        ],
      ),
    ),
  );
}

Widget _createListItem({IconData icon, String title, Function onTap}) => ListTile(
      title: Row(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(left: 15.0, right: 5),
            child: Icon(icon),
          ),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(left: 15.0),
              child: Text(title),
            ),
          ),
        ],
      ),
      onTap: onTap,
    );