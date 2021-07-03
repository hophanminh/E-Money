import 'dart:convert';
import 'dart:io';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/models/WalletsProvider.dart';
import 'package:mobile/src/services/icon_service.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/services/socketservices/socket.dart';
import 'package:mobile/src/views/ui/profile/avatar_picker_menu.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/delete_transaction_image.dart';
import 'package:mobile/src/views/ui/wallet/private_wallet/edit_transaction.dart';
import 'package:mobile/src/views/ui/wallet/rollback/rollback_view.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:outline_material_icons/outline_material_icons.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';
import 'package:provider/provider.dart';
import 'package:socket_io_client/socket_io_client.dart';

class ViewTransaction extends StatefulWidget {
  final String txId;

  const ViewTransaction({Key key, @required this.txId}) : super(key: key);

  @override
  _ViewTransactionState createState() => _ViewTransactionState();
}

class _ViewTransactionState extends State<ViewTransaction> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();

  Socket _socket;
  List<dynamic> _imageList = [];
  List<IconCustom> _iconList = [];

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
    _iconList = await IconService.instance.iconList;

    _socket = await getSocket();
    _socket.emitWithAck('get_transaction_image', {'TransactionID': widget.txId}, ack: (data) {
      if (!mounted) {
        return;
      }
      setState(() {
        _imageList = _sortImageList(data['imageList']);
      });
    });

    _socket.on('wait_for_add_transaction_image_${widget.txId}', (data) {
      if (!mounted) {
        return;
      }
      List<dynamic> concatenatedList = List<dynamic>.from(_imageList);
      concatenatedList.addAll(data['urls']); // urls là 1 list các map
      setState(() {
        _imageList = _sortImageList(concatenatedList);
      });
    });

    _socket.on('wait_for_remove_transaction_image_${widget.txId}', (data) {
      // data['imageID'] là 1 string
      _removeImgById(data['imageID']);
    });

    setState(() {});
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
    if (!mounted) {
      return;
    }
    setState(() {
      _imageList = _sortImageList(filteredList);
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: _appBar(),
        body: SingleChildScrollView(
          padding: EdgeInsets.only(bottom: 10),
          child: Consumer<WalletsProvider>(builder: (context, walletsProvider, child) {
            String tempId = walletsProvider.selected != null ? walletsProvider.selected.iconID : '';
            IconCustom selectedIcon = _iconList.firstWhere((element) => element.id == tempId, orElse: () => new IconCustom(id: '', name: '', color: '', backgroundColor: ''));

            return walletsProvider.selected != null
                ? Column(
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
                          decoration: BoxDecoration(borderRadius: BorderRadius.only(topLeft: Radius.circular(20.0), topRight: Radius.circular(20.0)), color: Colors.white),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Transform.translate(
                                  offset: Offset(0, -45),
                                  child: Container(
                                      padding: EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: Color(int.parse('0xFF' + (selectedIcon.backgroundColor == '' ? '#FFFFFF' : selectedIcon.backgroundColor).substring(1))),
                                        borderRadius: BorderRadius.all(Radius.circular(20)),
                                        border: Border.all(color: Colors.white, width: 5),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.grey.withOpacity(0.5),
                                            spreadRadius: 4,
                                            blurRadius: 5,
                                            offset: Offset(0, 2), // changes position of shadow
                                          ),
                                        ],
                                      ),
                                      child: selectedIcon.name == ''
                                          ? Container()
                                          : Icon(
                                              IconData(int.parse('${OMIcons.codePoints[selectedIcon.name]}'),
                                                  fontFamily: 'outline_material_icons', fontPackage: 'outline_material_icons'),
                                              size: 90,
                                              color: Colors.white,
                                            ))),
                              Text(
                                walletsProvider.selected.categoryName,
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
                              )
                            ],
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        child: Text(
                          '${formatMoneyWithSymbol(walletsProvider.selected.price)}',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 45, color: walletsProvider.selected.price > 0 ? Colors.green : Colors.red),
                        ),
                      ),
                      _createDetail('Ngày giao dịch', convertToDDMMYYYYHHMM(walletsProvider.selected.time), Icon(Icons.looks_one_outlined)),
                      _createDetail(
                          'Sự kiện', walletsProvider.selected.eventName == null ? 'Không có sự kiện được chọn' : walletsProvider.selected.eventName, Icon(Icons.event_available)),
                      _createDetail('Ghi chú', walletsProvider.selected.description.length == 0 ? 'Không có chú thích được tạo' : walletsProvider.selected.description,
                          Icon(Icons.textsms_outlined)),
                      _createTxImageListView()
                    ],
                  )
                : Container();
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

    List<File> images = [];
    images.add(File(pickedImage.path));
    _handleAddTxImage(images);
  }

  _imgFromGallery() async {
    final pickedImages = await ImagePicker().getMultiImage(imageQuality: 50);
    if (pickedImages == null) {
      return;
    }

    if (pickedImages.length > 5) {
      showSnack(_scaffoldKey, 'Tối đa 5 ảnh được chọn. Hãy thử lại!');
      return;
    }

    List<File> images = pickedImages.map((e) => File(e.path)).toList();
    _handleAddTxImage(images);
  }

  _handleAddTxImage(List<File> image) async {
    showSnack(_scaffoldKey, 'Đang xử lý...', duration: -1);
    String txId = Provider.of<WalletsProvider>(context, listen: false).selected.id;

    StreamedResponse streamedResponse = await WalletService.instance.addTxImage(txId, image);
    String response = await streamedResponse.stream.bytesToString(); //Response.fromStream(streamedResponse);
    Map<String, dynamic> body = jsonDecode(response);

    if (streamedResponse.statusCode == 200) {
      // List<dynamic> concatenatedList = List<dynamic>.from(_imageList);
      // concatenatedList.addAll(body['urls']);
      // setState(() {
      //   _imageList = _sortImageList(concatenatedList);
      // });

      _socket.emit('add_transaction_image', {'transactionID': txId, 'urls': body['urls']});
      showSnack(_scaffoldKey, 'Thêm thành công');
    } else {
      showSnack(_scaffoldKey, body['msg']);
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

  _createTxImageListView() => Padding(
        padding: const EdgeInsets.all(20.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.image_outlined),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 4),
              child: Text(
                'Ảnh',
                style: TextStyle(fontSize: 15, color: Colors.black54),
              ),
            ),
            Expanded(
              child: GridView.builder(
                padding: EdgeInsets.only(left: 20),
                scrollDirection: Axis.vertical,
                physics: ScrollPhysics(),
                shrinkWrap: true,
                itemCount: _imageList.length + 1,
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: MediaQuery.of(context).orientation == Orientation.landscape ? 4 : 3,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: (4 / 4),
                ),
                itemBuilder: (context, index) {
                  // for (String key in _imageList[index].keys) {
                  //   print('${key} - ${_imageList[index][key]}');
                  // }
                  if (index == 0) {
                    return GestureDetector(
                      onTap: () {
                        showGeneralDialog(
                            context: context,
                            barrierLabel: "Label",
                            barrierDismissible: true,
                            barrierColor: Colors.black.withOpacity(0.5),
                            transitionDuration: Duration(milliseconds: 500),
                            pageBuilder: (context, ani1, ani2) => createBottomImgPickerMenu(context, _imgFromGallery, _imgFromCamera),
                            transitionBuilder: (context, ani1, ani2, child) =>
                                SlideTransition(position: Tween(begin: Offset(0, 1), end: Offset(0, 0)).animate(ani1), child: child));
                      },
                      child: Container(
                        margin: EdgeInsets.only(bottom: 3, top: 2),
                        decoration: BoxDecoration(boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.5),
                            spreadRadius: 1,
                            blurRadius: 2,
                            offset: Offset(0, 1), // changes position of shadow
                          ),
                        ], color: Colors.white, borderRadius: BorderRadius.all(Radius.circular(10))),
                        width: 70,
                        height: 70,
                        child: Icon(Icons.add_a_photo_outlined),
                      ),
                    );
                  }
                  // else
                  return Stack(
                    children: [
                      // để cliprrect này lắp đầy stack
                      Positioned.fill(
                          child: ClipRRect(child: Image(image: NetworkImage(_imageList[index - 1]['URL']), fit: BoxFit.fill), borderRadius: BorderRadius.all(Radius.circular(10)))),
                      Material(
                        color: Colors.transparent,
                        child: InkWell(
                          splashFactory: InkRipple.splashFactory,
                          // customBorder: CircleBorder(),
                          child: Container(),
                          onTap: () {
                            _open(context, index - 1);
                          },
                          onLongPress: () {
                            showDialog(
                                context: context,
                                builder: (_) => DeleteTransactionImageDialog(
                                      wrappingScaffoldKey: _scaffoldKey,
                                      imageID: _imageList[index - 1]['ID'],
                                      txID: widget.txId,
                                      removeImageByID: _removeImgById,
                                    ));
                          },
                        ),
                      ),
                    ],
                  );
                },
              ),
            )
          ],
        ),
      );

  AppBar _appBar() => AppBar(
      shadowColor: Colors.transparent,
      iconTheme: IconThemeData(color: Colors.white),
      title: Text('Chi tiết giao dịch', style: TextStyle(color: Colors.white)),
      actions: [
        IconButton(
          icon: Icon(Icons.edit, size: 26),
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => EditTransaction(wrappingScaffoldKey: _scaffoldKey)));
          },
        ),
        IconButton(
          icon: Icon(
            Icons.history,
            size: 26,
          ),
          onPressed: () {
            showDialog(
                context: context,
                builder: (_) => TxChangedDiaryDialog(
                      wrappingScaffoldKey: _scaffoldKey,
                      walletID: Provider.of<UsersProvider>(context, listen: false).info.walletID,
                    ));
          },
        )
      ],
      backgroundColor: primary,
      centerTitle: true);

  void _open(BuildContext context, final int index) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => GalleryPhotoViewWrapper(
          galleryItems: _imageList,
          backgroundDecoration: const BoxDecoration(
            color: Colors.black,
          ),
          initialIndex: index,
          scrollDirection: Axis.horizontal,
        ),
      ),
    );
  }
}

class GalleryPhotoViewWrapper extends StatefulWidget {
  GalleryPhotoViewWrapper({
    this.loadingBuilder,
    this.backgroundDecoration,
    this.minScale,
    this.maxScale,
    this.initialIndex = 0,
    @required this.galleryItems,
    this.scrollDirection = Axis.horizontal,
  }) : pageController = PageController(initialPage: initialIndex);

  final LoadingBuilder loadingBuilder;
  final BoxDecoration backgroundDecoration;
  final dynamic minScale;
  final dynamic maxScale;
  final int initialIndex;
  final PageController pageController;
  final List<dynamic> galleryItems;
  final Axis scrollDirection;

  @override
  State<StatefulWidget> createState() {
    return _GalleryPhotoViewWrapperState();
  }
}

class _GalleryPhotoViewWrapperState extends State<GalleryPhotoViewWrapper> {
  int currentIndex;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    currentIndex = widget.initialIndex;
  }

  void onPageChanged(int index) {
    setState(() {
      currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: widget.backgroundDecoration,
        constraints: BoxConstraints.expand(
          height: MediaQuery.of(context).size.height,
        ),
        child: Stack(
          alignment: Alignment.bottomRight,
          children: <Widget>[
            PhotoViewGallery.builder(
              scrollPhysics: const BouncingScrollPhysics(),
              builder: _buildItem,
              itemCount: widget.galleryItems.length,
              loadingBuilder: widget.loadingBuilder,
              backgroundDecoration: widget.backgroundDecoration,
              pageController: widget.pageController,
              onPageChanged: onPageChanged,
              scrollDirection: widget.scrollDirection,
            ),
            Container(
              padding: const EdgeInsets.all(20.0),
              child: Text(
                "Đăng vào lúc ${convertToDDMMYYYYHHMM(widget.galleryItems[currentIndex]['DateAdded'])}",
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 17.0,
                  decoration: null,
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  PhotoViewGalleryPageOptions _buildItem(BuildContext context, int index) {
    final dynamic item = widget.galleryItems[index];
    return PhotoViewGalleryPageOptions(
      imageProvider: NetworkImage(item['URL']),
      initialScale: PhotoViewComputedScale.contained,
      minScale: PhotoViewComputedScale.contained * (0.5 + index / 10),
      maxScale: PhotoViewComputedScale.covered * 4.1,
      heroAttributes: PhotoViewHeroAttributes(tag: item['ID']),
    );
  }
}
