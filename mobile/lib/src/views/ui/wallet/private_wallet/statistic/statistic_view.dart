import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:mobile/src/models/UsersProvider.dart';
import 'package:mobile/src/services/restapiservices/wallet_service.dart';
import 'package:mobile/src/views/utils/helpers/helper.dart';
import 'package:mobile/src/views/utils/widgets/widget.dart';
import 'package:provider/provider.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:timelines/timelines.dart';

class Statistic extends StatefulWidget {
  final List<Color> availableColors = [
    Colors.purpleAccent,
    Colors.yellow,
    Colors.lightBlue,
    Colors.orange,
    Colors.pink,
    Colors.redAccent,
  ];

  @override
  _StatisticState createState() => _StatisticState();
}

class _StatisticState extends State<Statistic> {
  var _scaffoldKey = GlobalKey<ScaffoldMessengerState>();
  bool _nothingToShow = true;
  bool _isLoading = true;
  List<DateTime> _dates = [];
  DateTime _selectedDate;
  int _totalIncome = 0;
  int _totalOutCome = 0;
  List<charts.Series<dynamic, String>> _barChartSeries = [];
  List<charts.Series<dynamic, String>> _spentPieChartSeries = [];
  List<charts.Series<dynamic, String>> _incomePieChartSeries = [];

  _countPercent(int total, int partial) {
    return double.parse((partial * 100 / total).toStringAsFixed(2));
  }

  handleSelectMonth(DateTime date) async {
    bool nothingToShow = false;
    String toString = convertToYYYYMMDD(date.toString());
    List<Response> responses = await Future.wait(
        [WalletService.instance.getBarChartData(toString), WalletService.instance.getPieChartData(toString, true), WalletService.instance.getPieChartData(toString, false)]);

    if (responses[1].statusCode != 200 || responses[2].statusCode != 200) {
      nothingToShow = true;
    }

    Map<String, dynamic> barChartDataBody = jsonDecode(responses[0].body);
    List<dynamic> _barChartData = barChartDataBody['chartData']; //  1 list các hashmap

    if (nothingToShow) {
      if (mounted) {
        setState(() {
          _nothingToShow = nothingToShow;
          _barChartSeries = [
            charts.Series(
                domainFn: (dynamic data, _) => data['Title'],
                // dynamic ở dây là 1 hashmap
                measureFn: (dynamic data, _) => data['Money'].abs(),
                colorFn: (dynamic data, _) => data['Title'] == 'Chi' ? charts.MaterialPalette.deepOrange.makeShades(1)[0] : charts.MaterialPalette.lime.makeShades(1)[0],
                id: 'Money',
                data: _barChartData,
                labelAccessorFn: (dynamic data, _) => '${formatMoneyWithoutSymbol(data['Money'].abs())}')
          ];
        });
      }
      return;
    }

    Map<String, dynamic> spentPieChartDataBody = jsonDecode(responses[1].body);
    Map<String, dynamic> incomePieChartDataBody = jsonDecode(responses[2].body);
    incomePieChartDataBody['chartData'].removeWhere((item) => item['Money'] == 0);
    List<dynamic> _incomePieChart = incomePieChartDataBody['chartData'];

    spentPieChartDataBody['chartData'].removeWhere((item) => item['Money'] == 0);
    List<dynamic> _spentPieChart = spentPieChartDataBody['chartData'];

    int totalIcome = 0;
    for (dynamic data in _incomePieChart) {
      totalIcome += data['Money'];
    }

    int totalOutCome = 0;

    for (dynamic data in _spentPieChart) {
      totalOutCome += data['Money'];
    }

    if (!mounted) {
      return;
    }

    setState(() {
      _totalIncome = totalIcome;
      _totalOutCome = totalOutCome;
      _nothingToShow = nothingToShow;
      _barChartSeries = [
        charts.Series(
            domainFn: (dynamic data, _) => data['Title'],
            // dynamic ở dây là 1 hashmap
            measureFn: (dynamic data, _) => data['Money'].abs(),
            colorFn: (dynamic data, _) => data['Title'] == 'Chi' ? charts.MaterialPalette.deepOrange.makeShades(1)[0] : charts.MaterialPalette.lime.makeShades(1)[0],
            id: 'Money',
            data: _barChartData,
            labelAccessorFn: (dynamic data, _) => '${formatMoneyWithoutSymbol(data['Money'].abs())}')
      ];

      _incomePieChartSeries = [
        charts.Series(
            domainFn: (dynamic data, _) => data['Name'],
            // dynamic ở dây là 1 hashmap
            measureFn: (dynamic data, _) => data['Money'].abs(),
            id: 'Money1',
            data: _incomePieChart,
            labelAccessorFn: (dynamic data, _) => '${_countPercent(totalIcome, data['Money'])}%',
            colorFn: (_, index) => charts.MaterialPalette.lime.makeShades(incomePieChartDataBody['chartData'].length)[index],
            insideLabelStyleAccessorFn: (_, __) => charts.TextStyleSpec(color: charts.MaterialPalette.black)),
      ];

      _spentPieChartSeries = [
        charts.Series(
            domainFn: (dynamic data, _) => data['Name'],
            // dynamic ở dây là 1 hashmap
            measureFn: (dynamic data, _) => data['Money'].abs(),
            id: 'Money2',
            data: _spentPieChart,
            labelAccessorFn: (dynamic data, _) => '${_countPercent(totalOutCome, data['Money'])}%',
            colorFn: (_, index) => charts.MaterialPalette.deepOrange.makeShades(spentPieChartDataBody['chartData'].length)[index],
            insideLabelStyleAccessorFn: (_, __) => charts.TextStyleSpec(color: charts.MaterialPalette.black))
      ];
    });
  }

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((timeStamp) async {
      final UsersProvider myProvider = Provider.of<UsersProvider>(context, listen: false);

      List<DateTime> dates = [];
      DateTime activeDate = parseInput(myProvider.info.activatedDate).toLocal();
      DateTime current = DateTime.now();
      DateTime temp = new DateTime(activeDate.year, activeDate.month);

      while (temp.isBefore(current)) {
        dates.insert(0, temp);
        temp = new DateTime(temp.year, temp.month + 1);
      }

      if (mounted) {
        setState(() {
          _dates = dates;
          _selectedDate = dates[0];
        });
      }

      handleSelectMonth(_selectedDate);

      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    Widget body = Container(
      width: MediaQuery.of(context).size.width,
      child: Row(
        children: [
          Container(
            width: 76,
            child: SizedBox(
              child: Timeline.tileBuilder(
                theme: TimelineThemeData(
                  nodePosition: 0,
                  connectorTheme: ConnectorThemeData(
                    thickness: 5.0,
                    color: Color(0xffd3d3d3),
                  ),
                  indicatorTheme: IndicatorThemeData(
                    size: 25.0,
                  ),
                ),
                builder: TimelineTileBuilder.connected(
                  firstConnectorBuilder: (_) {
                    return SolidLineConnector(
                      color: primary,
                      thickness: 5,
                    );
                  },
                  contentsAlign: ContentsAlign.basic,
                  contentsBuilder: (context, i) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 85),
                    child: Container(),
                  ),
                  connectorBuilder: (_, index, __) {
                    return SolidLineConnector(
                      color: primary,
                      thickness: 5,
                    );
                  },
                  indicatorBuilder: (_, i) {
                    if (i == _dates.length) {
                      // end point
                      return Container(
                        width: 75,
                        decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: primary, width: 5), color: primary),
                        margin: EdgeInsets.zero,
                        padding: EdgeInsets.all(15),
                      );
                    }
                    return Material(
                      child: InkWell(
                        onTap: () {
                          if (_dates[i] == _selectedDate) {
                            return;
                          }

                          setState(() {
                            _selectedDate = _dates[i];
                          });

                          handleSelectMonth(_dates[i]);
                        },
                        child: Container(
                          width: 75,
                          decoration: BoxDecoration(
                              color: _dates[i] == _selectedDate ? Colors.lightGreen : Theme.of(context).scaffoldBackgroundColor,
                              shape: BoxShape.circle,
                              border: Border.all(color: primary, width: 4),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.grey.withOpacity(0.5),
                                  spreadRadius: 2,
                                  blurRadius: 3,
                                  offset: Offset(0, 2), // changes position of shadow
                                ),
                              ]),
                          margin: EdgeInsets.zero,
                          padding: EdgeInsets.all(13),
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text('${convertToMMYYYYY(_dates[i].toString(), isShortYear: true)}',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: _dates[i] == _selectedDate ? Colors.white : Colors.black)),
                          ),
                        ),
                      ),
                    );
                  },
                  itemCount: _dates.length + 1,
                ),
              ),
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.only(top: 20, bottom: 20, right: 6, left: 5),
                width: MediaQuery.of(context).size.width,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    _isLoading
                        ? Container()
                        : FittedBox(
                            child: Container(
                                constraints: BoxConstraints(maxWidth: 450),
                                padding: EdgeInsets.all(10),
                                decoration: BoxDecoration(color: const Color(0xfff2f2f2), borderRadius: BorderRadius.circular(10), boxShadow: [
                                  BoxShadow(
                                    color: Colors.grey.withOpacity(0.5),
                                    spreadRadius: 4,
                                    blurRadius: 5,
                                    offset: Offset(0, 2), // changes position of shadow
                                  )
                                ]),
                                height: 350,
                                child: charts.BarChart(
                                  _barChartSeries,
                                  animate: true,
                                  // barRendererDecorator: new charts.BarLabelDecorator<String>(
                                  //     //          insideLabelStyleSpec: new charts.TextStyleSpec(...),
                                  //     //          outsideLabelStyleSpec: new charts.TextStyleSpec(...)),
                                  //     ),
                                  primaryMeasureAxis: new charts.NumericAxisSpec(
                                    renderSpec: new charts.GridlineRendererSpec(
                                      axisLineStyle: charts.LineStyleSpec(thickness: 10),
                                      labelStyle: new charts.TextStyleSpec(
                                          fontSize: 13, // size in Pts.
                                          color: charts.MaterialPalette.black),
                                    ),
                                  ),
                                  behaviors: [
                                    charts.ChartTitle(
                                      'Tổng quan tình hình thu chi tháng ${convertToMMYYYYY(_selectedDate.toString())}',
                                      subTitle: '(Đơn vị: ${formatter.currencySymbol})',
                                      behaviorPosition: charts.BehaviorPosition.top,
                                      titleOutsideJustification: charts.OutsideJustification.middle,
                                      innerPadding: 50,
                                      titleStyleSpec: charts.TextStyleSpec(fontSize: 20),
                                    ),
                                  ],
                                )),
                          ),
                    _nothingToShow
                        ? Container(
                            padding: EdgeInsets.all(20),
                            alignment: Alignment.topCenter,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 20.0),
                                  child: Icon(
                                    Icons.error_outline,
                                    size: 50,
                                  ),
                                ),
                                Text(
                                  'Chưa có dữ liệu hiển thị',
                                  style: TextStyle(fontSize: 20),
                                ),
                              ],
                            ),
                          )
                        : Column(
                            children: [
                              _totalIncome != 0
                                  ? FittedBox(
                                      child: Container(
                                          constraints: BoxConstraints(maxWidth: 450),
                                          padding: EdgeInsets.all(10),
                                          margin: EdgeInsets.only(top: 20,bottom: 20),
                                          decoration: BoxDecoration(color: const Color(0xfff2f2f2), borderRadius: BorderRadius.circular(10), boxShadow: [
                                            BoxShadow(
                                              color: Colors.grey.withOpacity(0.5),
                                              spreadRadius: 4,
                                              blurRadius: 5,
                                              offset: Offset(0, 2), // changes position of shadow
                                            ),
                                          ]),
                                          height: 350,
                                          child: charts.PieChart(
                                            _incomePieChartSeries,
                                            animate: true,
                                            defaultRenderer: new charts.ArcRendererConfig(arcWidth: 40, arcRendererDecorators: [new charts.ArcLabelDecorator()]),
                                            behaviors: [
                                              new charts.ChartTitle(
                                                'Phân tích thu',
                                                behaviorPosition: charts.BehaviorPosition.top,
                                                titleOutsideJustification: charts.OutsideJustification.start,
                                                innerPadding: 35,
                                                titleStyleSpec: charts.TextStyleSpec(fontSize: 20),
                                              ),
                                              new charts.DatumLegend(
                                                position: charts.BehaviorPosition.bottom,
                                                horizontalFirst: false,
                                                cellPadding: new EdgeInsets.only(right: 4.0, bottom: 4.0),
                                                showMeasures: true,
                                                legendDefaultMeasure: charts.LegendDefaultMeasure.firstValue,
                                                measureFormatter: (num value) {
                                                  return value == null ? '-' : '-   ${formatMoneyWithSymbol(value)}';
                                                },
                                              ),
                                            ],
                                          )),
                                    )
                                  : Container(
                                      padding: EdgeInsets.all(20),
                                    ),
                              _totalOutCome != 0
                                  ? FittedBox(
                                      child: Container(
                                          constraints: BoxConstraints(maxWidth: 450),
                                          padding: EdgeInsets.all(10),
                                          margin: EdgeInsets.only(bottom: 20),
                                          decoration: BoxDecoration(color: const Color(0xfff2f2f2), borderRadius: BorderRadius.circular(10), boxShadow: [
                                            BoxShadow(
                                              color: Colors.grey.withOpacity(0.5),
                                              spreadRadius: 4,
                                              blurRadius: 5,
                                              offset: Offset(0, 2),
                                            ),
                                          ]),
                                          height: 350,
                                          child: charts.PieChart(
                                            _spentPieChartSeries,
                                            animate: true,
                                            defaultRenderer: new charts.ArcRendererConfig(arcWidth: 40, arcRendererDecorators: [new charts.ArcLabelDecorator()]),
                                            behaviors: [
                                              new charts.ChartTitle(
                                                'Phân tích chi',
                                                // subTitle: '(Đơn vị: ${formatter.currencySymbol})',
                                                behaviorPosition: charts.BehaviorPosition.top,
                                                titleOutsideJustification: charts.OutsideJustification.start,
                                                innerPadding: 35,
                                                titleStyleSpec: charts.TextStyleSpec(fontSize: 20),
                                              ),
                                              new charts.DatumLegend(
                                                position: charts.BehaviorPosition.bottom,
                                                horizontalFirst: false,
                                                cellPadding: new EdgeInsets.only(right: 4.0, bottom: 4.0),
                                                showMeasures: true,
                                                legendDefaultMeasure: charts.LegendDefaultMeasure.firstValue,
                                                measureFormatter: (num value) {
                                                  return value == null ? '-' : '-   ${formatMoneyWithSymbol(value)}';
                                                },
                                              ),
                                            ],
                                          )),
                                    )
                                  : Container()
                            ],
                          )
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
    // }

    return ScaffoldMessenger(
      key: _scaffoldKey,
      child: Scaffold(
        appBar: mySimpleAppBar('Thống kê ví cá nhân'),
        body: body,
      ),
    );
  }
}
