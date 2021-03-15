const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
    addTransaction: entity => db.add('exchanges', entity),

    updateTransaction: (id, updatedFields) => db.patch('exchanges', updatedFields, { ID: id }),

    deleteTransaction: (id) => db.delete(`exchanges`, { ID: id }),

    getDefaultCategory: () => {
        const isDefault = config.CATEGORY.DEFAULT;
        return db.loadSafe(`SELECT et.*, COUNT(e.ID) as count
                    FROM exchangetypes as et LEFT JOIN exchanges as e ON et.ID = e.ExchangeTypeID
                    WHERE et.WalletID IS NULL AND et.isDefault = ?
                    GROUP BY et.ID;`, [isDefault]);
    },

    getCustomCategoryFromWalletID: (walletID) => {
        const isDefault = config.CATEGORY.CUSTOM;
        return db.loadSafe(`SELECT et.*, COUNT(e.ID)
                    FROM exchangetypes as et LEFT JOIN exchanges as e ON et.ID = e.ExchangeTypeID
                    WHERE et.WalletID = ? AND et.isDefault = ?
                    GROUP BY et.ID;`, [walletID, isDefault]);
    },

    getAllCategoryFromWalletID: (walletID) => {
        return db.loadSafe(`SELECT et.*
                    FROM exchangetypes as et
                    WHERE et.WalletID = ? OR et.WalletID IS NULL`, [walletID]);
    },

}