import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import PieChart, {
  Legend,
  Series,
  Label,
  Font,
  Connector,
  Tooltip
} from 'devextreme-react/pie-chart';
import { makeStyles } from '@material-ui/core/styles';
import { PIE_CHART_PALETTE } from '../../constants/palette.json';
import { MARKER_SIZE, FONT_SIZE } from '../../constants/config.json';
import { customizeTextForLegend, customizeTextForLabel, customizeTextForTooltip } from '../../utils/helper';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px'
  },
  paper: {
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: '20px'
  }
}));

const chartData = [
  { type: 'Học tập', value: 6250000 },
  { type: 'Ăn uống', value: 1250000 },
  { type: 'Di chuyển', value: 1250000 },
  { type: 'Mua sắm', value: 1250000 },
];

export default function Statistic() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '50%' }}>
          <Paper className={classes.paper}>
            <PieChart
              id="pie"
              palette={PIE_CHART_PALETTE}
              dataSource={chartData}
              title="Thống kê chi tiêu tháng"
            >
              <Legend
                orientation="horizontal"
                itemTextPosition="right"
                horizontalAlignment="center"
                verticalAlignment="bottom"
                customizeText={arg => customizeTextForLegend(arg.pointName, chartData[arg.pointIndex].value)}
                columnCount={4}
                markerSize={MARKER_SIZE}
              >
                <Font size={FONT_SIZE.LEGEND_FONT_SIZE} />
              </Legend>
              <Series argumentField="type" valueField="value">
                <Label
                  visible={true}
                  position="columns"
                  customizeText={customizeTextForLabel}
                >
                  <Font size={FONT_SIZE.LABEL_FONT_SIZE} />
                  <Connector visible={true} width={0.5} />
                </Label>
              </Series>
              <Tooltip enabled={true} customizeTooltip={customizeTextForTooltip}>
                <Font size={FONT_SIZE.TOOLTIP_FONT_SIZE} />
              </Tooltip>
            </PieChart>
          </Paper>
        </div>
        <div style={{ width: '50%', textAlign: 'justify', marginLeft: '50px' }}>
          <Typography style={{ color: '#172755', fontSize: '32px', fontWeight: 'bold' }}>
            Thống kê tài chính
          </Typography>
          <Typography style={{ color: '#8794ba', marginTop: '20px' }}>
            E-Money sẽ giúp người dùng tạo báo cáo hoạt động thu chi một cách trực quan, dễ phân tích. Người dùng sẽ dựa vào biểu đồ phân tích mà có phương án chi tiêu hiệu quả hơn trong tương lai.
          </Typography>
        </div>
      </div>
    </div >
  );
}
