import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import HorizontalTimeline from "react-horizontal-timeline";
import Charts from './charts.js';

const EXAMPLE = [
  {
    date: "2018-03",
  },
  {
    date: "2018-04",
  },
  {
    date: "2018-05",
  },
  {
    date: "2018-06",
  },
  {
    date: "2018-07",
  },
  {
    date: "2018-08",
  },
  {
    date: "2018-09",
  }
];

export default function Statistic() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [preIndex, setPreIndex] = useState(-1);

  const changeDate = (index) => {
    setPreIndex(currentIndex);
    setCurrentIndex(index);
  }

  return (
    <>
      <Container component="main" maxWidth="xl">
        <div>
          {/* Bounding box for the Timeline */}
          <div
            style={{ width: "80%", height: "100px", margin: "0 auto", marginTop: "20px", display: 'flex', alignItems: 'stretch' }}
          >
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
              minEventPadding={100}
              maxEventPadding={100}
              index={currentIndex}
              indexClick={index => changeDate(index)}
              values={EXAMPLE.map((x) => x.date)}
            />
          </div>

          <div className="text-center">
            {/* any arbitrary component can go here */}
            {EXAMPLE[currentIndex].date}
            <Charts date={new Date(EXAMPLE[currentIndex].date)} />
          </div>
        </div>
      </Container>
    </>
  );
}