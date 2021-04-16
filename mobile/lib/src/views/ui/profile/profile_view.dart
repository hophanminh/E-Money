import 'dart:io';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/src/views/ui/profile/avatar_picker_menu.dart';
import 'package:mobile/src/views/ui/profile/avatar_preview.dart';
import 'package:mobile/src/views/ui/profile/change_password_dialog.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/services/restapiservices/user_service.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class ProfilePage extends StatefulWidget {
  final Map<String, dynamic> user;
  final void Function(Map<String, dynamic>) setUser;

  const ProfilePage({this.user, this.setUser});

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  var _formKey = GlobalKey<FormState>();
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _nameController = TextEditingController();
  var _emailController = TextEditingController();
  var _dobController = TextEditingController();
  var _selectedDate = DateTime.now(); // example: 2021-04-15 23:58:18.949076
  Map<String, dynamic> _user;

  void setInfo() {
    _nameController.text = widget.user['Name'];
    _emailController.text = widget.user['Email'];

    if (widget.user['DateOfBirth'] != null) {
      print(widget.user['DateOfBirth']);
      setState(() {
        _selectedDate = DateTime.parse(widget.user['DateOfBirth']); // example: 1999-09-15 17:00:00.000Z
      });
      _dobController.text = convertToDDMMYYYY(widget.user['DateOfBirth']);
    } else {
      print(_selectedDate.toString());
      print(_selectedDate.toIso8601String());
      _dobController.text = convertToDDMMYYYY(_selectedDate.toLocal().toString());
    }
  }

  @override
  void initState() {
    super.initState();
    _user = new Map<String, dynamic>.from(widget.user);
    setInfo();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _dobController.dispose();
    super.dispose();
  }

  void handleChangeInfo() async {
    FocusScope.of(context).unfocus();
    String name = _nameController.text;
    String email = _emailController.text;
    String dob = _selectedDate.toIso8601String();
    Response res = await UserService.instance.changeInfo(name, email, dob);

    if (res.statusCode == 200) {
      showSnack(_scaffoldKey, 'Cập nhật thành công');
      _user['Name'] = name;
      _user['Email'] = email;
      _user['DateOfBirth'] = dob;
      widget.setUser(_user);
    } else {
      showSnack(_scaffoldKey, 'Đã xảy ra sự cố, hãy thử lại');
    }
  }

  void _imgFromCamera() async {
    final pickedImage = await ImagePicker().getImage(source: ImageSource.camera, imageQuality: 50);
    if (pickedImage == null) {
      return;
    }
    Navigator.push(context,
        MaterialPageRoute(builder: (context) => AvatarPreview(image: File(pickedImage.path), user: widget.user, setUser: widget.setUser, profileScaffoldKey: _scaffoldKey)));
  }

  void _imgFromGallery() async {
    final pickedImage = await ImagePicker().getImage(source: ImageSource.gallery, imageQuality: 50);
    if (pickedImage == null) {
      return;
    }
    Navigator.push(context,
        MaterialPageRoute(builder: (context) => AvatarPreview(image: File(pickedImage.path), setUser: widget.setUser, user: widget.user, profileScaffoldKey: _scaffoldKey)));
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: mySimpleAppBar('Hồ sơ cá nhân'),
        body: RefreshIndicator(
          onRefresh: () => Future.delayed(Duration(milliseconds: 500), () {
            FocusScope.of(context).unfocus();
            setInfo();
          }),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  decoration: BoxDecoration(
                      border: Border.all(width: 0, color: Colors.white), image: DecorationImage(image: AssetImage('assets/images/background1.jpg'), fit: BoxFit.cover)),
                  child: Container(
                    // this container is to create linear transparent background covering on the above container
                    decoration: BoxDecoration(
                      border: Border.all(width: 0, color: Colors.white),
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: <Color>[Colors.transparent, Colors.white24, Colors.white30, Colors.white, Colors.white],
                      ),
                    ),
                    padding: EdgeInsets.fromLTRB(20, 100, 20, 20),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            Container(
                              constraints: BoxConstraints(maxWidth: 200),
                              decoration: BoxDecoration(
                                  border: new Border.all(
                                    color: Colors.lightGreen,
                                    width: 4.0,
                                  ),
                                  shape: BoxShape.circle),
                              width: MediaQuery.of(context).size.width * 0.35,
                              height: MediaQuery.of(context).size.width * 0.35,
                              child: myCircleAvatar(widget.user['AvatarURL'], 50),
                            ),
                            Container(
                              // this container cover the above container to show ripple effect whan tapping on avatar
                              constraints: BoxConstraints(maxWidth: 200),
                              width: MediaQuery.of(context).size.width * 0.35,
                              height: MediaQuery.of(context).size.width * 0.35,
                              child: Material(
                                shape: CircleBorder(),
                                color: Colors.transparent,
                                child: InkWell(
                                  splashFactory: InkRipple.splashFactory,
                                  customBorder: CircleBorder(),
                                  child: Container(),
                                  onTap: () {
                                    showGeneralDialog(
                                        context: context,
                                        barrierLabel: "Label",
                                        barrierDismissible: true,
                                        barrierColor: Colors.black.withOpacity(0.5),
                                        transitionDuration: Duration(milliseconds: 500),
                                        pageBuilder: (context, ani1, ani2) => createBottomMenu(context, _imgFromGallery, _imgFromCamera),
                                        transitionBuilder: (context, ani1, ani2, child) =>
                                            SlideTransition(position: Tween(begin: Offset(0, 1), end: Offset(0, 0)).animate(ani1), child: child));
                                  },
                                ),
                              ),
                            ),
                          ],
                        ),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(left: 20.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 8.0),
                                  child: Text(_user['Name'], style: TextStyle(fontWeight: FontWeight.bold, fontSize: 21), overflow: TextOverflow.ellipsis, maxLines: 4),
                                ),
                                FittedBox(
                                  child: Text(
                                    'Ngày tham gia: ${convertToDDMMYYYY(_user['ActivatedDate'])}',
                                    style: TextStyle(fontSize: 15),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 30.0, right: 30.0, top: 15, bottom: 50),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        myLabelText('Tên tài khoản'),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                            style: TextStyle(color: Colors.black26),
                            initialValue: _user['Username'],
                            readOnly: true,
                            decoration: myInputDecoration('Tên tài khoản', inputBorder: Colors.black26),
                          ),
                        ),
                        myLabelText('Tên hiển thị'),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                            controller: _nameController,
                            decoration: myInputDecoration('Tên hiển thị', inputBorder: Colors.black26),
                            validator: (String value) {
                              if (value == null || value.isEmpty) {
                                return 'Tên không được để trống';
                              }
                              return null;
                            },
                          ),
                        ),
                        myLabelText('Email'),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                            controller: _emailController,
                            decoration: myInputDecoration('Email', inputBorder: Colors.black26),
                            validator: (String value) {
                              if (value.isEmpty) {
                                return 'Email không được để trống';
                              }
                              if (isEmailPattern(value) == false) {
                                return 'Email không hợp lệ';
                              }
                              return null;
                            },
                          ),
                        ),
                        myLabelText('Ngày sinh'),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                          child: TextFormField(
                            controller: _dobController,
                            showCursor: true,
                            readOnly: true,
                            // keyboardType: TextInputType.datetime,
                            // initialValue: convertISOToNormalDate(_user['DateOfBirth']),
                            decoration: myInputDecoration('Bạn chưa chọn ngày sinh', inputBorder: Colors.black26),
                            onTap: () {
                              _selectDOB();
                            },
                            validator: (String value) {
                              // if (value == null || value.isEmpty) {
                              //   return 'Tên tài khoản không được để trống';
                              // }
                              // if (value.contains(' ')) {
                              //   return 'Tên tài khoản không được chứa khoảng trắng';
                              // }
                              return null;
                            },
                          ),
                        ),
                        myAlignedButton('Cập nhật', alignment: Alignment.centerRight, action: () {
                          if (_formKey.currentState.validate()) {
                            showSnack(_scaffoldKey, 'Đang xử lý...');
                            handleChangeInfo();
                          }
                        }),
                        Padding(
                          padding: const EdgeInsets.only(top: 20.0, bottom: 10),
                          child: myLabelText('Mật khẩu'),
                        ),
                        myAlignedButton('Thay mật khẩu', alignment: Alignment.centerRight, backgroundColor: warning, action: () {
                          showDialog(context: context, builder: (_) => ChangePasswordDialog(wrappingScaffoldKey: _scaffoldKey));
                        }),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  _selectDOB() async {
    final DateTime picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      helpText: 'Chọn ngày sinh',
      cancelText: 'Hủy',
      confirmText: 'Chọn',
      errorFormatText: 'Ngày sinh không đúng định dạng',
      errorInvalidText: 'Ngày sinh không hợp lệ',
      initialDatePickerMode: DatePickerMode.year,
    );
    print(picked);
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      print('307');
      print(picked.toString());
      print(picked.toIso8601String());
      print(picked.toLocal().toString());
      _dobController.text = convertToDDMMYYYY(picked.toUtc().toIso8601String());
    }
  }
}
