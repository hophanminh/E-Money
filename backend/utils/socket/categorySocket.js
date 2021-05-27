const categoryModel = require('../../models/categoryModel');
const eventModel = require('../../models/eventModel');
const transactionModel = require('../../models/transactionModel');
const config = require("../../config/default.json");

const { v4: uuidv4 } = require('uuid');
const { ISO_8601 } = require("moment");
const historyModel = require('../../models/historyModel');

module.exports = function (socket, io, decoded_userID) {

  // get category of wallet
  socket.on('get_category', async ({ walletID }, callback) => {
    socket.join(walletID);
    try {
      const defaultList = await categoryModel.getDefaultCategory(walletID) || [];
      const customList = await categoryModel.getCustomCategoryFromWalletID(walletID) || [];
      const fullList = defaultList.concat(customList);
      callback({ defaultList, customList, fullList });
    } catch (error) {
      console.log(error);
    }

  });

    // add category
    socket.on('add_category', async ({ walletID, newCategory }) => {
        try {
            const ID = uuidv4();
            const temp = {
                ID: ID,
                Name: newCategory.Name,
                IsDefault: newCategory.IsDefault ? newCategory.IsDefault : false,
                WalletID: walletID,
                IconID: newCategory.IconID,
            }
            await categoryModel.addCategory(temp);

      // annouce to other players
      const defaultList = await categoryModel.getDefaultCategory(walletID) || [];
      const customList = await categoryModel.getCustomCategoryFromWalletID(walletID) || [];
      const fullList = defaultList.concat(customList);
      io.in(walletID).emit('wait_for_update_category', { defaultList, customList, fullList });
    } catch (error) {
      console.log(error);
    }
  });

  // update category
  socket.on('update_category', async ({ walletID, categoryID, newCategory }, callback) => {
    try {
      const temp = {
        Name: newCategory.Name,
        IsDefault: false,
        IconID: newCategory.IconID,
      }
      const updated = await categoryModel.getCategoryByID(categoryID);
      if (updated.length === 1) {
        await categoryModel.updateCategory(categoryID, temp);

        callback ? callback() : console.log('ko có call back khi end event');

        // annouce to other players
        const defaultList = await categoryModel.getDefaultCategory(walletID) || [];
        const customList = await categoryModel.getCustomCategoryFromWalletID(walletID) || [];
        const fullList = defaultList.concat(customList);
        io.in(walletID).emit('wait_for_update_category', { defaultList, customList, fullList });
      }
    } catch (error) {
      console.log(error);
    }
  });
  
        // update category
        socket.on('update_category_default', async ({ walletID, categoryID, newCategory, IsDefault }) => {
            try {
                console.log(IsDefault);
                const temp = {
                    Name: newCategory.Name,
                    IsDefault: true,
                    IconID: newCategory.IconID,
                }
                const updated = await categoryModel.getCategoryByID(categoryID);
                if (updated.length === 1) {
                    await categoryModel.updateCategory(categoryID, temp);
    
                    // annouce to other players
                    const defaultList = await categoryModel.getDefaultCategory(walletID) || [];
                    const customList = [];
                    const fullList = defaultList.concat(customList);
                    io.in(walletID).emit('wait_for_update_category', { defaultList, customList, fullList });
                }
            } catch (error) {
                console.log(error);
            }
        });


  // delete category
  socket.on('delete_category', async ({ walletID, id }, callback) => {
    try {
      const deleted = await categoryModel.getCategoryByID(id);
      if (deleted.length === 1) {
        // change transaction in deleted category to default category
        await transactionModel.updateTransactionCategory(walletID, id, config.CATEGORY.DEFAULT_ID)
        await eventModel.updateEventCategory(walletID, id, config.CATEGORY.DEFAULT_ID)
        await historyModel.updateHistoryCategory(walletID, id, config.CATEGORY.DEFAULT_ID)

        await categoryModel.deleteCategory(id);

        callback ? callback() : console.log('ko có call back khi end event');

        // annouce to other players
        const defaultList = await categoryModel.getDefaultCategory(walletID) || [];
        const customList = await categoryModel.getCustomCategoryFromWalletID(walletID) || [];
        const fullList = defaultList.concat(customList);
        io.in(walletID).emit('wait_for_update_category', { defaultList, customList, fullList });
      }
    } catch (error) {
      console.log(error);
    }

  });

    // delete category
    socket.on('delete_category_default', async ({ id }) => {
        try {
            const deleted = await categoryModel.getCategoryByID(id);
            if (deleted.length === 1) {
                console.log("Here")
                // change transaction in deleted category to default category
                await transactionModel.updateTransactionCategoryDefault(id, config.CATEGORY.DEFAULT_ID)
                await eventModel.updateEventCategoryDefault(id, config.CATEGORY.DEFAULT_ID)
                await historyModel.updateHistoryCategoryDefault(id, config.CATEGORY.DEFAULT_ID)

                await categoryModel.deleteCategory(id);

                // annouce to other players
                const defaultList = await categoryModel.getDefaultCategory(walletID) || [];
                const customList = [];
                const fullList = defaultList.concat(customList);
                io.in(walletID).emit('wait_for_update_category', { defaultList, customList, fullList });
            }
        } catch (error) {
            console.log(error);
        }

    });

};
