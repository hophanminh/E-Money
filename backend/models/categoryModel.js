const db = require('../utils/database');
const config = require('../config/default.json');

module.exports = {
    addCategory: entity => db.add('Categories', entity),

    updateCategory: (id, updatedFields) => db.patch('Categories', updatedFields, { ID: id }),

    deleteCategory: (id) => db.delete(`Categories`, { ID: id }),

    getDefaultCategory: () => {
        const isDefault = config.CATEGORY.DEFAULT;
        return db.loadSafe(`SELECT cat.*, COUNT(t.ID) as count
                    FROM Categories as cat LEFT JOIN Transactions as t ON cat.ID = t.CategoryID
                    WHERE cat.WalletID IS NULL AND cat.isDefault = ?
                    GROUP BY cat.ID
                    ORDER BY cat.Name`, [isDefault]);
    },

    getCustomCategoryFromWalletID: (walletID) => {
        const isDefault = config.CATEGORY.CUSTOM;
        return db.loadSafe(`SELECT cat.*, COUNT(t.ID) as count
                    FROM Categories as cat LEFT JOIN Transactions as t ON cat.ID = t.CategoryID
                    WHERE cat.WalletID = ? AND cat.isDefault = ?
                    GROUP BY cat.ID
                    ORDER BY cat.Name`, [walletID, isDefault]);
    },

    getAllCategoryFromWalletID: (walletID) => {
        return db.loadSafe(`SELECT cat.*
                    FROM Categories as cat
                    WHERE cat.WalletID = ? OR cat.WalletID IS NULL
                    ORDER BY cat.isDefault DESC, cat.Name ASC`, [walletID]);
    },

    getCategoryByID: (categoryID) =>
        db.loadSafe(`SELECT cat.*
                FROM Categories as cat
                WHERE cat.ID = ?`, [categoryID]),

}