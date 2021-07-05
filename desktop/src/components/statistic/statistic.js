import React, { useContext, useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import HorizontalTimeline from "react-horizontal-timeline";
import moment from 'moment';
import MyContext from '../mycontext/MyContext';
import Charts from './charts.js';
import config from '../../constants/config.json';

const API_URL = config.API_LOCAL;

export default function Statistic() {
  const userID = localStorage.getItem('userID');
  const jwtToken = localStorage.getItem('jwtToken');
  const { info } = useContext(MyContext);
  const [dates, setDates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preIndex, setPreIndex] = useState(-1);
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartSpentData, setPieChartSpentData] = useState([]);
  const [pieChartIncomeData, setPieChartIncomeData] = useState([]);

  const calculateDates = (activatedDate) => {
    const startDate = moment(activatedDate).set('date', 1);
    const endDate = moment();
    let list = [];
    while (startDate.isBefore(endDate)) {
      list.push(startDate.format("YYYY-MM-01"));
      startDate.add(1, 'month');
    }
    setCurrentIndex(list.length - 1);
    setPreIndex(list.length - 2);
    setDates(list);
  }

  useEffect(() => {
    calculateDates(info.ActivatedDate);
  }, []);

  const changeDate = (index) => {
    getBarChartData(dates[index]);
    getPieChartData(dates[index], true);
    getPieChartData(dates[index], false);
    setPreIndex(currentIndex);
    setCurrentIndex(index);
  }

  useEffect(() => {
    if (dates.length > 0) {
      changeDate(dates.length - 1);
    }
  }, [dates]);

  const getBarChartData = async (date) => {
    const data = {
      userID: userID,
      date: date
    }

    // call API here
    const res = await fetch(`${API_URL}/statistic/barChart`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    });

    if (res.status === 200) {
      const result = await res.json();
      const chartData = result.chartData.map(data => {
        return {
          title: data.Title,
          money: data.Money >= 0 ? data.Money : data.Money * -1
        };
      });
      setBarChartData(chartData);
    } else {
      setBarChartData(null);
    }
  }

  const getPieChartData = async (date, isSpent) => {
    const data = {
      userID: userID,
      date: date,
      isSpent: isSpent
    }

    // call API here
    const res = await fetch(`${API_URL}/statistic/pieChart`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`
      }
    });

    if (res.status === 200) {
      const result = await res.json();
      const chartData = result.chartData.map(data => {
        return {
          type: data.Name,
          value: data.Money < 0 ? data.Money * -1 : data.Money
        };
      });
      let temp = [];
      chartData.forEach(data => {
        if (data.value > 0) {
          temp.push(data);
        }
      });
      if (isSpent) {
        setPieChartSpentData(temp);
      } else {
        setPieChartIncomeData(temp);
      }
    } else {
      if (isSpent) {
        setPieChartSpentData([]);
      } else {
        setPieChartIncomeData([]);
      }
    }
  }

  return (
    <>
      <Container component="main" maxWidth="xl">
        <div>
          {/* Bounding box for the Timeline */}
          <div style={{
            width: "80%", height: "100px", margin: "0 auto", marginTop: "20px",
            display: 'flex', alignItems: 'stretch'
          }}>
            <HorizontalTimeline
              styles={{
                background: "#f8f8f8",
                foreground: "#1A79AD",
                outline: "#dfdfdf",
              }}
              getLabel={date => {
                const temp = (new Date(date)).toDateString(); // Thu Jul 01 1999
                return temp.slice(4, 7) + temp.slice(10);     // Jul 1999
              }}
              minEventPadding={150}
              maxEventPadding={150}
              index={currentIndex}
              indexClick={index => changeDate(index)}
              values={dates}
            />
          </div>

          <div className="text-center">
            {/* any arbitrary component can go here */}
            <Charts
              date={new Date(dates[currentIndex])}
              barChartData={barChartData}
              pieChartSpentData={pieChartSpentData}
              pieChartIncomeData={pieChartIncomeData}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
