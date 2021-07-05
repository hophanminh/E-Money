module.exports = function (socket, io, decoded_userID) {
  // get Transaction of wallet
  socket.on('update_profile', ({ user }) => {
    socket.broadcast.emit(`update_profile_${decoded_userID}`, { user });
  });
}