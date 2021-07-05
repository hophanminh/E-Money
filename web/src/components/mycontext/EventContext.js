import React, { useState, createContext } from 'react';

const EventContext = createContext({});
export default EventContext;

export const EventProvider = (props) => {
  const [selected, setSelected] = useState();
  const [eventList, setEventList] = useState([]);
  const [eventTypeList, setTypeList] = useState([]);

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
  );
}
