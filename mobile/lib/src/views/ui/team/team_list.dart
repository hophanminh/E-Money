import 'dart:convert';
import 'package:http/http.dart';
import 'package:flutter/material.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/services/restapiservices/auth_service.dart';
import 'package:mobile/src/services/restapiservices/team_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';

class TeamList extends StatefulWidget {
  final Drawer sidebar;
  final Map<String, dynamic> user;

  const TeamList({this.sidebar, this.user});

  @override
  _TeamListState createState() => _TeamListState();
}

class _TeamListState extends State<TeamList> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  List<Teams> _teamList = [];
  List<Teams> _filterList = [];

  final _searchController = TextEditingController();

  void _setTeamList(List<dynamic> teamList) {
    setState(() {
      _teamList = teamList;
      _filterList = teamList;
    });
  }

  void _onHandleChangeSearchBar() {
    if (_searchController.text.trim() != '') {
      setState(() {
        _filterList = _teamList
            .where((i) => i.name
                .toLowerCase()
                .contains(_searchController.text.toLowerCase()))
            .toList();
      });
    } else {
      setState(() {
        _filterList = _teamList;
        ;
      });
    }
  }

  void _fetchData() async {
    Response res = await TeamService.instance.getTeamList();
    if (res == null || res.statusCode != 200) {
      throw Exception("Không lấy được dữ liệu từ server");
    }
    Map<String, dynamic> body = jsonDecode(res.body);
    //Teams newTeam = Teams.fromJson(body["teams"][0]);

    List<Teams> teamList = [];
    for (int i = 0; i < body['teams'].length; i++) {
      teamList.add(Teams.fromJson(body['teams'][i]));
    }

    print(body['teams'][0]);
    _setTeamList(teamList);
  }

  @override
  void initState() {
    _fetchData();
    super.initState();
    _searchController.addListener(_onHandleChangeSearchBar);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
        key: _scaffoldKey,
        child: Scaffold(
            appBar: _privateWalletAppBar(),
            drawer: widget.sidebar,
            floatingActionButton: _privateWalletActionButton(),
            body: RefreshIndicator(
              onRefresh: () => Future.delayed(Duration(milliseconds: 500), () {
                FocusScope.of(context).unfocus();
                setState(() {
                  _searchController.clear();
                  _setTeamList(getTeamList());
                });
              }),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  makeList(),
                  makeSearchBar(),
                ],
              ),
            )));
  }

  Widget makeSearchBar() => Container(
        child: Column(
          children: <Widget>[
            SizedBox(
              height: 10,
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Material(
                elevation: 5.0,
                borderRadius: BorderRadius.all(Radius.circular(4)),
                child: TextField(
                  controller: _searchController,
                  cursorColor: Theme.of(context).primaryColor,
                  style: TextStyle(color: Colors.black, fontSize: 18),
                  decoration: InputDecoration(
                      hintText: "Tìm kiếm...",
                      hintStyle: TextStyle(color: Colors.black38, fontSize: 16),
                      prefixIcon: Material(
                        elevation: 0.0,
                        borderRadius: BorderRadius.all(Radius.circular(30)),
                        child: Icon(Icons.search),
                      ),
                      suffixIcon: IconButton(
                        onPressed: () => _searchController.clear(),
                        icon: Icon(Icons.clear),
                      ),
                      border: InputBorder.none,
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 25, vertical: 13)),
                ),
              ),
            ),
          ],
        ),
      );

  ListView makeList() => ListView.builder(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        itemCount: _filterList.length,
        itemBuilder: (BuildContext context, int index) {
          if (index == 0) {
            return Container(
              child: Column(
                children: [
                  SizedBox(height: 75),
                  makeCard(_filterList[index]),
                ],
              ),
            );
          }
          return makeCard(_filterList[index]);
        },
      );

  Card makeCard(Teams lesson) => Card(
        elevation: 0,
        color: Colors.transparent,
        margin: new EdgeInsets.symmetric(horizontal: 20.0, vertical: 6.0),
        child: Material(
            child: Ink(
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(15.0),
                    color: Color.fromRGBO(64, 75, 96, .9)),
                child: InkWell(
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text(lesson.toString()),
                      ));
                    },
                    child: makeListTile(lesson)))),
      );

  ListTile makeListTile(Teams lesson) => ListTile(
        contentPadding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        leading: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Container(
                padding: EdgeInsets.only(right: 12.0),
                decoration: new BoxDecoration(
                    border: new Border(
                        right:
                            new BorderSide(width: 1.0, color: Colors.white24))),
                child: Column(children: <Widget>[
                  Text(lesson.currentUsers.toString(),
                      style: TextStyle(color: Colors.white)),
                  Text('Người',
                      style: TextStyle(color: Colors.white, fontSize: 10)),
                ])),
          ],
        ),
        isThreeLine: lesson.description != '',
        title: Text(
          lesson.name,
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        // subtitle: Text("Intermediate", style: TextStyle(color: Colors.white)),
        subtitle: lesson.description != ''
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          lesson.description,
                          style: TextStyle(color: Colors.white),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              )
            : null,
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(Icons.keyboard_arrow_right, color: Colors.white, size: 30.0),
          ],
        ),
        onTap: () {},
      );

  AppBar _privateWalletAppBar() => AppBar(
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Danh sách nhóm', style: TextStyle(color: Colors.white)),
      backgroundColor: primary,
      centerTitle: true);

  FloatingActionButton _privateWalletActionButton() => FloatingActionButton(
      onPressed: () {},
      tooltip: 'Thêm giao dịch',
      child: Icon(Icons.add),
      backgroundColor: secondary,
      foregroundColor: Colors.white);

  List<Teams> getTeamList() {
    return [
      Teams(
          id: '1',
          name: 'name3',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
      Teams(
          id: '1',
          name: 'name1',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
      Teams(
          id: '1',
          name: 'name1',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
      Teams(
          id: '1',
          name: 'name1',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
      Teams(
          id: '1',
          name: 'name1',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
      Teams(
          id: '1',
          name: 'name1',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
      Teams(
          id: '1',
          name: 'name1',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
      Teams(
          id: '1',
          name: 'name1',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
      Teams(
          id: '1',
          name: 'name1',
          maxUsers: 1,
          currentUsers: 12,
          description: '1',
          createdDate: '1/1/1',
          walletID: '1'),
    ];
  }
}
