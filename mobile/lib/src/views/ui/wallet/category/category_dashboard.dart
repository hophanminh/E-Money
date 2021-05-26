import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:mobile/src/views/ui/wallet/category/add_cat.dart';
import 'package:mobile/src/views/ui/wallet/category/delete_cate.dart';
import 'package:mobile/src/views/ui/wallet/category/edit_cat.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';

class CategoryDashboard extends StatefulWidget {
  final String walletID;
  final List<dynamic> txs;
  final List<dynamic> defaultList;
  final List<dynamic> customList;
  final Function(List<dynamic>, List<dynamic>, List<dynamic>) setCategoryList;

  const CategoryDashboard({Key key, @required this.walletID, @required this.txs, @required this.defaultList, @required this.customList, @required this.setCategoryList})
      : super(key: key);

  @override
  _CategoryDashboardState createState() => _CategoryDashboardState();
}

class _CategoryDashboardState extends State<CategoryDashboard> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
        key: _scaffoldKey,
        child: Scaffold(
          appBar: mySimpleAppBar('Quản lý phân loại giao dịch'),
          body: SingleChildScrollView(
            child: Container(
              padding: EdgeInsets.fromLTRB(10, 30, 10, 50),
              width: MediaQuery.of(context).size.width,
              child: Column(
                children: [
                  Align(alignment: Alignment.centerLeft, child: Text('Loại mặc định', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25))),
                  _createDefaultCategoryListView(),
                  Padding(
                    padding: const EdgeInsets.only(top: 20.0),
                    child: Align(alignment: Alignment.centerLeft, child: Text('Loại tự chọn', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25))),
                  ),
                  _createCustomCategoryListView()
                ],
              ),
            ),
          ),
          floatingActionButton: _catDashboardActionButton(),
        ));
  }

  _createDefaultCategoryListView() {
    // if(widget.txs == null) {
    //   return Container();
    // }
    List<int> catCount = [];

    for (int i = 0; i < widget.defaultList.length; i++) {
      int sum = 0;
      widget.txs.forEach((tx) {
        if (widget.defaultList[i]['ID'] == tx['catID']) {
          sum++;
        }
      });

      catCount.add(sum);
    }

    return widget.defaultList.length == 0
        ? Container(
            padding: EdgeInsets.all(20),
            child: Text('Chưa có loại giao dịch mặc định nào'),
          )
        : GridView.builder(
            physics: ScrollPhysics(),
            padding: EdgeInsets.symmetric(vertical: 20, horizontal: 5),
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemCount: widget.defaultList.length,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: MediaQuery.of(context).orientation == Orientation.landscape ? 2 : 1,
              crossAxisSpacing: 20,
              mainAxisSpacing: 20,
              childAspectRatio: (30 / 8),
            ),
            itemBuilder: (context, index) {
              // for (String key in _defaultList[index].keys) {
              //   print('${key} - ${_defaultList[index][key]}');
              // }
              return Container(
                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 30),
                decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.2),
                      spreadRadius: 3,
                      blurRadius: 4,
                      offset: Offset(0, 2), // changes position of shadow
                    ),
                  ],
                  color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                ),
                child: Row(
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(left: 10, right: 20.0),
                      child: FlutterLogo(size: 45),
                    ),
                    Expanded(
                        child: Text(
                      widget.defaultList[index]['Name'],
                      style: TextStyle(fontSize: 18),
                    )),
                    Container(
                      decoration: BoxDecoration(shape: BoxShape.circle, color: warning),
                      padding: EdgeInsets.symmetric(horizontal: 15),
                      child: Text('${catCount[index]}', style: TextStyle(fontSize: 18, color: Colors.white)),
                    )
                  ],
                ),
              );
            },
          );
  }

  _createCustomCategoryListView() {
    List<int> catCount = [];

    for (int i = 0; i < widget.customList.length; i++) {
      int sum = 0;
      widget.txs.forEach((tx) {
        if (widget.customList[i]['ID'] == tx['catID']) {
          sum++;
        }
      });
      catCount.add(sum);
    }

    return widget.customList.length == 0
        ? Container(
            padding: EdgeInsets.all(20),
            child: Text('Chưa có loại giao dịch của riêng bạn'),
          )
        : GridView.builder(
            physics: ScrollPhysics(),
            padding: EdgeInsets.symmetric(vertical: 20, horizontal: 5),
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemCount: widget.customList.length,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: MediaQuery.of(context).orientation == Orientation.landscape ? 2 : 1,
              crossAxisSpacing: 20,
              mainAxisSpacing: 20,
              childAspectRatio: (30 / 8),
            ),
            itemBuilder: (context, index) {
              // for (String key in _defaultList[index].keys) {
              //   print('${key} - ${_defaultList[index][key]}');
              // }
              return Slidable(
                actionPane: SlidableDrawerActionPane(),
                actionExtentRatio: 0.25,
                secondaryActions: <Widget>[
                  IconSlideAction(
                    caption: 'Sửa',
                    color: Colors.blue,
                    icon: Icons.edit,
                    onTap: () async {
                      await showDialog(
                          context: context,
                          builder: (_) => EditCatDialog(
                                wrappingScaffoldKey: _scaffoldKey,
                                walletID: widget.walletID,
                                cat: widget.customList[index],
                              ));

                      setState(() {
                        // _defaultList = widget.defaultList;
                      });
                    },
                  ),
                  IconSlideAction(
                    caption: 'Xóa',
                    color: warning,
                    icon: Icons.delete_outline,
                    onTap: () async {
                      await showDialog(
                          context: context,
                          builder: (_) => DeleteCateDialog(
                                wrappingScaffoldKey: _scaffoldKey,
                                walletID: widget.walletID,
                                cateID: widget.customList[index]['ID'],
                              ));

                      setState(() {
                        // _defaultList = widget.defaultList;
                      });
                    },
                  ),
                ],
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 30),
                  decoration: BoxDecoration(
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.2),
                        spreadRadius: 3,
                        blurRadius: 4,
                        offset: Offset(0, 2), // changes position of shadow
                      ),
                    ],
                    color: Colors.white,
                    borderRadius: BorderRadius.all(Radius.circular(10)),
                  ),
                  child: Row(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(left: 10, right: 20.0),
                        child: FlutterLogo(size: 45),
                      ),
                      Expanded(
                          child: Text(
                        widget.customList[index]['Name'],
                        style: TextStyle(fontSize: 18),
                      )),
                      Container(
                        decoration: BoxDecoration(shape: BoxShape.circle, color: warning),
                        padding: EdgeInsets.symmetric(horizontal: 15),
                        child: Text('${catCount[index]}', style: TextStyle(fontSize: 18, color: Colors.white)),
                      )
                    ],
                  ),
                ),
              );
            },
          );
  }

  FloatingActionButton _catDashboardActionButton() => FloatingActionButton(
      onPressed: () {
        showDialog(
            context: context,
            builder: (_) => AddCatDialog(
                  wrappingScaffoldKey: _scaffoldKey,
                  walletID: widget.walletID,
                ));
      },
      tooltip: 'Thêm loại giao dịch mới',
      child: Icon(Icons.add),
      backgroundColor: secondary,
      foregroundColor: Colors.white);
}
