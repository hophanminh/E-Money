const eventModel = require('../../models/eventModel');
const eventTypeModel = require('../../models/eventTypeModel');
const { v4: uuidv4 } = require('uuid');
const { convertToRegularDate, convertToRegularDateTime, getNextEventDate } = require('../helper');
module.exports = function (socket, io, decoded_userID) {

  // get event of wallet
  socket.on('get_event', async ({ walletID }, callback) => {
    socket.join(walletID); console.log(walletID);
    try {
      const eventList = await eventModel.getEventByWalletID(walletID);
      callback({ eventList });
    } catch (error) {
      console.log(error);
    }

  });

  socket.on('get_event_type', async ({ }, callback) => {
    try {
      const eventTypeList = await eventTypeModel.getAllEventType();
      callback({ eventTypeList });
    } catch (error) {
      console.log(error);
    }

  });

  // add event
  socket.on('add_event', async ({ walletID, newEvent }, callback) => {
    console.log(newEvent);
    try {
      const ID = uuidv4();
      const temp = {
        ID: ID,
        Name: newEvent.Name,
        StartDate: convertToRegularDateTime(newEvent.StartDate),
        EndDate: newEvent.EndDate ? convertToRegularDateTime(newEvent.EndDate) : null,
        NextDate: getNextEventDate(newEvent.StartDate, newEvent.TypeName, newEvent.Value),
        Status: 1,
        Value: newEvent.Value,
        ExpectingAmount: newEvent.ExpectingAmount,
        WalletID: walletID,
        CategoryID: newEvent.CategoryID,
        EventTypeID: newEvent.EventTypeID,
        Description: newEvent.Description
      }
      await eventModel.addEvent(temp);

      callback ? callback() : console.log('ko có call back khi add event');

      // annouce to other players
      const eventList = await eventModel.getEventByWalletID(walletID);
      io.in(walletID).emit('wait_for_update_event', { eventList });

    } catch (error) {
      console.log(error);
    }
  });

  // delete event
  socket.on('end_event', async ({ walletID, id }, callback) => {
    try {
      const temp = {
        Status: 0,
        EndDate: convertToRegularDateTime(new Date())
      }
      const ended = await eventModel.getEventByID(id);
      if (ended.length === 1) {
        await eventModel.updateEvent(id, temp);
      }
      callback ? callback() : console.log('ko có call back khi end event');
      // annouce to other players
      const eventList = await eventModel.getEventByWalletID(walletID);
      io.in(walletID).emit('wait_for_update_event', { eventList });
    } catch (error) {
      console.log(error);
    }

  });

};
