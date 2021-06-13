const { v4: uuidv4 } = require('uuid');
const iconModel = require('../../models/iconModel');

module.exports = function (socket, io, decoded_userID) {
    socket.on('get_icons', async ({ }, callback) => {
        try {
            const iconList = await iconModel.getAllIcons();
            callback({ iconList });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('add_icon', async ({ newIcon }) => {
        try {
            const entity = {
                Name: newIcon.name,
                Color: newIcon.color,
                BackgroundColor: newIcon.backgroundColor
            }

            await iconModel.addIcon(entity);
            const iconList = await iconModel.getAllIcons();
            io.emit('wait_for_update_icon', { iconList });
        } catch (error) {
            console.log(error);
        }
    });
};
