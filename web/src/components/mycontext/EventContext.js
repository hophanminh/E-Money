import React, { useState, useEffect, createContext } from 'react';
import config from '../../constants/config.json';
import { getSocket } from "../../utils/socket";
import moment from 'moment';

const API_URL = config.API_LOCAL;
const EventContext = createContext({});

export default EventContext;

export const EventProvider = (props) => {
  const socket = getSocket();

  const [selected, setSelected] = useState();
  const [eventList, setEventList] = useState([])
  const [eventTypeList, setTypeList] = useState([])

  return (
    <EventContext.Provider
      value={{
        selected,
        eventList,
        eventTypeList,

        setSelected,
        setEventList,
        setTypeList,
      }}>
      {props.children}
    </EventContext.Provider>
  )
}
