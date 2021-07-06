import 'package:flutter/material.dart';
import 'package:mobile/src/models/TeamsProvider.dart';
import 'package:mobile/src/models/NotificationProvider.dart';
import 'package:mobile/src/views/ui/team/add_team.dart';
import 'package:mobile/src/views/ui/team/join_team.dart';
import 'package:mobile/src/views/ui/wallet/team_wallet/team_wallet.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:provider/provider.dart';

class TeamList extends StatefulWidget {
  final Drawer sidebar;

  const TeamList({this.sidebar});

  @override
  _TeamListState createState() => _TeamListState();
}

class _TeamListState extends State<TeamList> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  bool _isLoading = true;
  final _searchController = TextEditingController(text: "");

  void _onHandleChangeSearchBar() {
    Provider.of<TeamsProvider>(context, listen: false).changeSearchString(_searchController.text.trim());
  }

  void _fetchData() async {
    NotificationProvider notificationProvider = Provider.of<NotificationProvider>(context, listen: false);
    TeamsProvider teamsProvider = Provider.of<TeamsProvider>(context, listen: false);

    bool res = await teamsProvider.fetchData();
    Map<String, dynamic> selected = notificationProvider.selected;
    print(res);
    if (res && selected != null) {
      Teams temp = teamsProvider.findTeams(selected['walletID']);
      if (temp != null) {
        teamsProvider.changeSelected(temp);
        Navigator.push(context, MaterialPageRoute(builder: (context) => TeamWallet(wrappingScaffoldKey: _scaffoldKey, walletId: temp.walletID)));
        await Future.delayed(const Duration(seconds: 1), () {});
      }
      else {
        notificationProvider.setSelected(null);
        showSnack(_scaffoldKey, "Không tìm thấy nhóm của giao dịch.");
      }
    }
    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
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
    return GestureDetector(
        onTap: () {
          FocusManager.instance.primaryFocus.unfocus();
        },
        child: ScaffoldMessenger(
            key: _scaffoldKey,
            child: Scaffold(
                appBar: _privateWalletAppBar(),
                drawer: widget.sidebar,
                floatingActionButton: _privateWalletActionButton(),
                body: _isLoading
                    ? Center(child: CircularProgressIndicator())
                    : RefreshIndicator(
                        onRefresh: () => Future.delayed(Duration(milliseconds: 500), () {
                              FocusScope.of(context).unfocus();
                              _searchController.clear();
                              _fetchData();
                            }),
                        child: Consumer<TeamsProvider>(
                          builder: (context, teamsProvider, child) {
                            List<Teams> list = _searchController.text == '' ? teamsProvider.teamList : teamsProvider.getFilterList();
                            return Stack(
                              fit: StackFit.expand,
                              children: [
                                makeList(list),
                                child,
                              ],
                            );
                          },
                          child: makeSearchBar(),
                        )))));
  }

  ListView makeList(List<Teams> _list) => ListView.builder(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        itemCount: _list.length,
        itemBuilder: (BuildContext context, int index) {
          if (index == 0) {
            return Container(
              child: Column(
                children: [
                  SizedBox(height: 75),
                  makeCard(_list[index]),
                ],
              ),
            );
          }
          return makeCard(_list[index]);
        },
      );

  Card makeCard(Teams team) => Card(
        elevation: 0,
        color: Colors.transparent,
        margin: new EdgeInsets.symmetric(horizontal: 20.0, vertical: 6.0),
        child: Material(borderRadius: BorderRadius.circular(15.0), color: Color.fromRGBO(64, 75, 96, .9), clipBehavior: Clip.hardEdge, child: makeListTile(team)),
      );

  ListTile makeListTile(Teams team) => ListTile(
        contentPadding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        leading: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Container(
                padding: EdgeInsets.only(right: 12.0),
                decoration: new BoxDecoration(border: new Border(right: new BorderSide(width: 1.0, color: Colors.white24))),
                child: Column(children: <Widget>[
                  Text(team.currentUsers.toString(), style: TextStyle(color: Colors.white)),
                  Text('Người', style: TextStyle(color: Colors.white, fontSize: 10)),
                ])),
          ],
        ),
        title: Text(
          team.name,
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        // subtitle: Text("Intermediate", style: TextStyle(color: Colors.white)),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(Icons.keyboard_arrow_right, color: Colors.white, size: 30.0),
          ],
        ),
        onTap: () async {
          FocusScope.of(context).unfocus();
          Provider.of<TeamsProvider>(context, listen: false).changeSelected(team);
          Navigator.push(context, MaterialPageRoute(builder: (context) => TeamWallet(wrappingScaffoldKey: _scaffoldKey, walletId: team.walletID)));

          // Navigator.push(
          //     context,
          //     MaterialPageRoute(
          //         builder: (context) =>
          //             TeamDetail(wrappingScaffoldKey: _scaffoldKey)));
        },
      );

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
                      contentPadding: EdgeInsets.symmetric(horizontal: 25, vertical: 13)),
                ),
              ),
            ),
          ],
        ),
      );

  AppBar _privateWalletAppBar() => AppBar(
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Danh sách nhóm', style: TextStyle(color: Colors.white)),
      actions: [
        IconButton(
          icon: Icon(Icons.group_add, size: 26),
          onPressed: () {
            showDialog(
                context: context,
                builder: (_) => JoinTeamDialog(
                      wrappingScaffoldKey: _scaffoldKey,
                    ));
          },
        ),
      ],
      backgroundColor: primary,
      centerTitle: true);

  FloatingActionButton _privateWalletActionButton() => FloatingActionButton(
      onPressed: () {
        FocusScope.of(context).unfocus();
        Navigator.push(context, MaterialPageRoute(builder: (context) => AddTeam(wrappingScaffoldKey: _scaffoldKey)));
      },
      tooltip: 'Thêm nhóm',
      child: Icon(Icons.add),
      backgroundColor: secondary,
      foregroundColor: Colors.white);
}
