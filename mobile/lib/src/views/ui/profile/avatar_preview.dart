import 'dart:convert';
import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/UsersProvider.dart';

class AvatarPreview extends StatefulWidget {
  final File image;
  final GlobalKey<ScaffoldMessengerState> profileScaffoldKey;

  AvatarPreview({Key key, this.image, this.profileScaffoldKey}): super(key: key);

  @override
  _AvatarPreviewState createState() => _AvatarPreviewState();
}

class _AvatarPreviewState extends State<AvatarPreview> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  bool isWaiting = false;

  @override
  dispose() {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.landscapeRight,
      DeviceOrientation.landscapeLeft,
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        appBar: AppBar(
          iconTheme: IconThemeData(color: Colors.white),
          title: Text('Xem trước ảnh', style: TextStyle(color: Colors.white)),
          actions: [
            IconButton(
              icon: Icon(
                Icons.check,
                size: 30,
                color: isWaiting == true ? Colors.grey : Colors.white,
              ),
              onPressed: () {
                isWaiting == true ? null : handleChangeAvatar();
              },
            ),
          ],
          backgroundColor: primary,
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          child: Center(
            child: Container(
              constraints: BoxConstraints(maxWidth: 250),
              width: MediaQuery.of(context).size.width,
              height: MediaQuery.of(context).size.width,
              decoration: BoxDecoration(
                border: new Border.all(
                  color: Colors.lightGreen,
                  width: 4.0,
                ),
                shape: BoxShape.circle,
              ),
              child: CircleAvatar(backgroundImage: FileImage(widget.image)),
            ),
          ),
        ),
      ),
    );
  }

  void handleChangeAvatar() async {
    setState(() {
      isWaiting = true;
    });
    showSnack(_scaffoldKey, 'Đang xử lý...', duration: -1);
    StreamedResponse streamedResponse = await UserService.instance.changeAvatar(widget.image);

    if (streamedResponse.statusCode == 200) {
      var response = await streamedResponse.stream.bytesToString(); //Response.fromStream(streamedResponse);
      Map<String, dynamic> body = jsonDecode(response);
      Provider.of<UsersProvider>(context, listen: false)
          .updateImage(body['url']);
      showSnack(widget.profileScaffoldKey, 'Cập nhật thành công');
      Navigator.of(context).pop();
    } else if (streamedResponse.statusCode == 500) {
      var response = await streamedResponse.stream.bytesToString(); //Response.fromStream(streamedResponse);
      Map<String, dynamic> body = jsonDecode(response);
      showSnack(_scaffoldKey, body['msg']);
    }
  }
}
