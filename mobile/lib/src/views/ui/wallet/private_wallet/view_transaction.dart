import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/src/models/WalletsProvider.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/profile/avatar_picker_menu.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/delete_transaction_image.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/edit_transaction.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart';

class ViewTransaction extends StatefulWidget {
  final List<dynamic> eventList;
  final List<dynamic> fullCategoryList;
  final String txId;

  const ViewTransaction({Key key, @required this.txId, @required this.eventList, @required this.fullCategoryList}) : super(key: key);

  @override
  _ViewTransactionState createState() => _ViewTransactionState();
}

class _ViewTransactionState extends State<ViewTransaction> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  Socket _socket;
  List<dynamic> _imageList = [];

  @override
  void initState() {
    super.initState();
    _initPage();
  }

  @override
  void dispose() {
    _socket.off('wait_for_add_transaction_image_${widget.txId}');
    _socket.off('wait_for_remove_transaction_image_${widget.txId}');
    super.dispose();
  }

  List<dynamic> _sortImageList(List<dynamic> imgs) {
    imgs.sort((img1, img2) => parseInput(img1['DateAdded']).isBefore(parseInput(img2['DateAdded'])) ? 1 : -1);
    return imgs;
  }

  _initPage() async {
    _socket = await getSocket();
    _socket.emitWithAck('get_transaction_image', {'TransactionID': widget.txId}, ack: (data) {
      // print(_sortImageList(data['imageList'])[0]);
      setState(() {
        _imageList = _sortImageList(data['imageList']);
      });
    });

    _socket.on('wait_for_add_transaction_image_${widget.txId}', (data) {
      print('CÓ ẢNH MỚI DC THÊM');
      List<dynamic> concatenatedList = List<dynamic>.from(_imageList);
      concatenatedList.addAll(data['urls']); // urls là 1 list các map
      setState(() {
        _imageList = _sortImageList(concatenatedList);
      });
    });

    _socket.on('wait_for_remove_transaction_image_${widget.txId}', (data) {
      print('XÓA ẢNH');
      // data['imageID'] là 1 string
      _removeImgById(data['imageID']);
    });
  }

  _removeImgById(String imgId) {
    List<dynamic> filteredList = List<dynamic>.from(_imageList);
    dynamic imageToRemove;

    for (dynamic image in filteredList) {
      if (image['ID'] == imgId) {
        imageToRemove = image;
        break;
      }
    }

    // final index = filteredList.indexOf(data['imageID']);
    filteredList.remove(imageToRemove);
    setState(() {
      _imageList = _sortImageList(filteredList);
    });
  }

  @override
  Widget build(BuildContext context) {
    WalletsProvider walletsProvider123 = Provider.of<WalletsProvider>(context);
    print(walletsProvider123.selected);
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: _appBar(),
        body: SingleChildScrollView(
          padding: EdgeInsets.only(bottom: 10),
          child: Consumer<WalletsProvider>(builder: (context, walletsProvider, child) {
            return walletsProvider.selected != null
                ?
            Column(
              children: [
                Container(
                    decoration: BoxDecoration(
                      border: Border.all(width: 0, color: primary),
                      color: primary,
                      // gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [primary, const Color(0xFFb4dc63)])
                    ),
                    width: MediaQuery.of(context).size.width,
                    height: 60),
                Container(
                  decoration: BoxDecoration(
                      border: Border(
                        left: BorderSide(
                          color: primary,
                          width: 0.0,
                        ),
                        top: BorderSide(
                          color: primary,
                          width: 0.0,
                        ),
                        right: BorderSide(
                          color: primary,
                          width: 0.0,
                        ),
                        bottom: BorderSide(
                          color: Colors.white,
                          width: 0.0,
                        ),
                      ),
                      color: primary),
                  width: MediaQuery.of(context).size.width,
                  child: Container(
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(20.0),
                            topRight: Radius.circular(20.0)),
                        color: Colors.white),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Transform.translate(
                            offset: Offset(0, -45),
                            child: Container(
                              padding: EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius:
                                BorderRadius.all(Radius.circular(20)),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.grey.withOpacity(0.5),
                                    spreadRadius: 4,
                                    blurRadius: 5,
                                    offset: Offset(
                                        0, 2), // changes position of shadow
                                  ),
                                ],
                              ),
                              child: FlutterLogo(
                                size: 90,
                              ),
                            )),
                        Text(
                          walletsProvider.selected.categoryName,
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 25),
                        )
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: Text(
                    '${formatMoneyWithSymbol(walletsProvider.selected.price)}',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 45,
                        color:
                        walletsProvider.selected.price > 0 ? Colors.green : Colors.red),
                  ),
                ),
                _createDetail(
                    'Ngày giao dịch',
                    convertToDDMMYYYYHHMM(walletsProvider.selected.time),
                    Icon(Icons.looks_one)),
                _createDetail(
                    'Sự kiện',
                    walletsProvider.selected.eventName == null
                        ? 'Không có sự kiện được chọn'
                        : walletsProvider.selected.eventName,
                    Icon(Icons.event_available)),
                _createDetail(
                    'Ghi chú',
                    walletsProvider.selected.description.length == 0
                        ? 'Không có chú thích được tạo'
                        : walletsProvider.selected.description,
                    Icon(Icons.textsms_outlined)),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Tooltip(
                    message: 'Thêm hình ảnh minh chứng giao dịch',
                    child: GestureDetector(
                      onTap: () {
                        showGeneralDialog(
                            context: context,
                            barrierLabel: "Label",
                            barrierDismissible: true,
                            barrierColor: Colors.black.withOpacity(0.5),
                            transitionDuration: Duration(milliseconds: 500),
                            pageBuilder: (context, ani1, ani2) =>
                                createBottomMenu(
                                    context, _imgFromGallery, _imgFromCamera),
                            transitionBuilder: (context, ani1, ani2, child) =>
                                SlideTransition(
                                    position: Tween(
                                        begin: Offset(0, 1),
                                        end: Offset(0, 0))
                                        .animate(ani1),
                                    child: child));
                      },
                      child: Container(
                        margin: EdgeInsets.only(left: 20, top: 20),
                        decoration: BoxDecoration(
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.withOpacity(0.5),
                                spreadRadius: 4,
                                blurRadius: 5,
                                offset:
                                Offset(0, 2), // changes position of shadow
                              ),
                            ],
                            color: Colors.white,
                            borderRadius:
                            BorderRadius.all(Radius.circular(10))),
                        width: 70,
                        height: 70,
                        child: Icon(Icons.add_a_photo_outlined),
                      ),
                    ),
                  ),
                ),
                _createTxImageListView()
              ],
            )
                :
            Container();
          }),
        ),
      ),
    );
  }

  _imgFromCamera() async {
    final pickedImage = await ImagePicker().getImage(source: ImageSource.camera, imageQuality: 50);
    if (pickedImage == null) {
      return;
    }

    File image = File(pickedImage.path);
    _handleAddTxImage(image);
  }

  _imgFromGallery() async {
    final pickedImage = await ImagePicker().getImage(source: ImageSource.gallery, imageQuality: 50);
    if (pickedImage == null) {
      return;
    }

    File image = File(pickedImage.path);
    _handleAddTxImage(image);
  }

  _handleAddTxImage(File image) async {
    showSnack(_scaffoldKey, 'Đang xử lý...', duration: -1);
    String txId = Provider.of<WalletsProvider>(context, listen: false).selected.id;

    StreamedResponse streamedResponse = await WalletService.instance.addTxImage(txId, image);

    if (streamedResponse.statusCode == 200) {
      var response = await streamedResponse.stream.bytesToString(); //Response.fromStream(streamedResponse);
      Map<String, dynamic> body = jsonDecode(response);
      List<dynamic> concatenatedList = List<dynamic>.from(_imageList);

      concatenatedList.addAll(body['urls']);
      setState(() {
        _imageList = _sortImageList(concatenatedList);
      });

      _socket.emit('add_transaction_image', {'transactionID': txId, 'urls': body['urls']});
      showSnack(_scaffoldKey, 'Thêm thành công');
    }
  }

  _createDetail(String key, String value, Icon icon) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          icon,
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Text(
              key,
              style: TextStyle(fontSize: 15, color: Colors.black54),
            ),
          ),
          Expanded(child: Text(value, textAlign: TextAlign.right, style: TextStyle(fontSize: 15)))
        ],
      ),
    );
  }

  _createTxImageListView() => GridView.builder(
        padding: EdgeInsets.all(20),
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        itemCount: _imageList.length,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: MediaQuery.of(context).orientation == Orientation.landscape ? 4 : 3,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
          childAspectRatio: (4 / 3),
        ),
        itemBuilder: (context, index) {
          for (String key in _imageList[index].keys) {
            print('${key} - ${_imageList[index][key]}');
          }
          return GestureDetector(
              onTap: () {},
              onLongPress: () {
                showDialog(
                    context: context,
                    builder: (_) => DeleteTransactionImageDialog(
                          wrappingScaffoldKey: _scaffoldKey,
                          imageID: _imageList[index]['ID'],
                          txID: widget.txId,
                          removeImageByID: _removeImgById,
                        ));
              },
              child: ClipRRect(child: Image(image: NetworkImage(_imageList[index]['URL']), fit: BoxFit.fill), borderRadius: BorderRadius.all(Radius.circular(10))));
        },
      );

  AppBar _appBar() => AppBar(
      shadowColor: Colors.transparent,
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Chi tiết giao dịch', style: TextStyle(color: Colors.white)),
      actions: [
        IconButton(
          icon: Icon(Icons.edit, size: 26),
          onPressed: () {
            Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => EditTransaction(
                        fullCategoryList: widget.fullCategoryList, eventList: widget.eventList, wrappingScaffoldKey: _scaffoldKey)));
          },
        )
      ],
      backgroundColor: primary,
      centerTitle: true);
}
