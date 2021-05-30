import React from 'react';
import Paper from '@material-ui/core/Paper';
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
import { customizeTextForLegend, customizeTextForLabel, customizeTextForTooltip } from '../../utils/helper';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '50px 20px 20px 30px',
  },
  paper: {
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    borderRadius: '20px'
  },
  chart: {
    padding: 20
  }
}));

export default function PieChartSpent({ date, chartData }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div style={{ alignContent: 'center' }}>
        <Paper className={classes.paper}>
          {chartData.length === 0 ?
            <div style={{ textAlign: 'center' }}>Không có dữ liệu</div> :
            <PieChart
              id="pie"
              className={classes.chart}
              palette={PIE_CHART_PALETTE}
              dataSource={chartData}
              title={"Thống kê các khoản thu tháng " + (date.getMonth() + 1) + "/" + date.getFullYear()}
            >
              <Legend
                orientation="horizontal"
                itemTextPosition="right"
                horizontalAlignment="center"
                verticalAlignment="bottom"
                customizeText={arg => customizeTextForLegend(arg.pointName, chartData[arg.pointIndex].value)}
                columnCount={4}
              />
              <Series argumentField="type" valueField="value">
                <Label
                  visible={true}
                  position="columns"
                  customizeText={customizeTextForLabel}
                >
                  <Font size={16} />
                  <Connector visible={true} width={0.5} />
                </Label>
              </Series>
              <Tooltip enabled={true} customizeTooltip={customizeTextForTooltip} />
            </PieChart>
          }
        </Paper>
      </div>
    </div>
  );
}