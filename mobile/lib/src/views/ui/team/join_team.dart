import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class JoinTeamDialog extends StatefulWidget {
  final GlobalKey<ScaffoldMessengerState> wrappingScaffoldKey;

  const JoinTeamDialog({Key key, @required this.wrappingScaffoldKey})
      : super(key: key);

  @override
  _JoinTeamDialogState createState() => _JoinTeamDialogState();
}

class _JoinTeamDialogState extends State<JoinTeamDialog> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  var _formKey = GlobalKey<FormState>();
  var _idController = TextEditingController(text: "");
  String customError = '';

  void _updateCustomError() {
    if (customError != '') {
      setState(() {
        customError = '';
      });
    }
  }

  @override
  void initState() {
    _idController.addListener(_updateCustomError);
    super.initState();
  }

  @override
  void dispose() {
    _idController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(15, 0, 15, 5),
            child: Form(
              autovalidateMode: AutovalidateMode.onUserInteraction,
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 20, bottom: 15),
                      child: Text(
                        'Tham gia nhóm',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 20),
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 10),
                    child: TextFormField(
                      controller: _idController,
                      decoration: myInputDecoration('',
                          inputBorder: Colors.black26,
                          maxErrorLine: 2,
                          label: 'Mã nhóm'),
                      validator: (String value) {
                        if (value == null ||
                            value.isEmpty ||
                            isBlankString(value)) {
                          return 'Mã không được để trống';
                        }
                        if (customError != '') {
                          return customError;
                        }
                        return null;
                      },
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: Text(
                            'Hủy',
                            style: TextStyle(fontSize: 16),
                          )),
                      TextButton(
                          onPressed: () {
                            if (_formKey.currentState.validate()) {
                              handleJoinTeam();
                            }
                          },
                          child: Text(
                            'Tham gia',
                            style: TextStyle(fontSize: 16),
                          )),
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void handleJoinTeam() async {
    String id = _idController.text;

    Response res = await TeamService.instance.joinTeam(id);

    if (res.statusCode == 201) {
      FocusScope.of(context).unfocus();
      Provider.of<TeamsProvider>(context, listen: false).fetchData();
      Navigator.pop(context);
      showSnack(widget.wrappingScaffoldKey, "Tham gia thành công");
    } else {
      Map<String, dynamic> body = jsonDecode(res.body);
      setState(() {
        customError = body['msg'];
      });
      _formKey.currentState.validate();
      await Future.delayed(const Duration(seconds: 1), () {});
    }
  }
}
