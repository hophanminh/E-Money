

module.exports = function (socket, io, decoded_userID) {

  // get Transaction of wallet
  socket.on('update_profile', ({ user }) => {
    console.log('update profile', decoded_userID);
    socket.broadcast.emit(`update_profile_${decoded_userID}`, { user });
  });
}