const db = require('../utils/database');

module.exports = {

  getDataForBarChart: (userID, month, year) => db.load(`
    SELECT IF(T.Money >= 0, 'Thu', 'Chi') AS Title, SUM(T.Money) AS Money
    FROM Transactions T JOIN Users U ON U.WalletID = T.WalletID
    WHERE U.ID = '${userID}' AND MONTH(T.DateAdded) = ${month} AND YEAR(T.DateAdded) = ${year}
    GROUP BY Title
    ORDER BY Title
  `),

  getDataForPieChart: (userID, month, year, isSpent) => db.load(`
    SELECT
      Cat.Name,
      SUM(CASE
        WHEN ${isSpent} = TRUE AND T.Money < 0 THEN T.Money
        WHEN ${isSpent} = FALSE AND T.Money >= 0 THEN T.Money 
        ELSE 0 END
      ) AS Money
    FROM Transactions T JOIN Users U ON U.WalletID = T.WalletID JOIN Categories Cat ON Cat.ID = T.CategoryID
    WHERE U.ID = '${userID}' AND MONTH(T.DateAdded) = ${month} AND YEAR(T.DateAdded) = ${year}
    GROUP BY Cat.Name
    ORDER BY Money DESC
  `),

  getDataForTeamBarChart: (teamID, month, year) => db.load(`
    SELECT IF(T.Money >= 0, 'Thu', 'Chi') AS Title, SUM(T.Money) AS Money
    FROM Transactions T JOIN Teams ON Teams.WalletID = T.WalletID
    WHERE Teams.ID = '${teamID}' AND MONTH(T.DateAdded) = ${month} AND YEAR(T.DateAdded) = ${year}
    GROUP BY Title
    ORDER BY Title
  `),

  getDataForTeamPieChart: (teamID, month, year, isSpent) => db.load(`
    SELECT
      COALESCE(U.Name, 'Cả nhóm') AS Name,
      SUM(CASE
        WHEN ${isSpent} = TRUE AND T.Money < 0 THEN T.Money
        WHEN ${isSpent} = FALSE AND T.Money > 0 THEN T.Money 
        ELSE 0 END
      ) AS Money
    FROM Transactions T JOIN Teams ON Teams.WalletID = T.WalletID LEFT JOIN Users U ON U.ID = T.UserID
    WHERE Teams.ID = '${teamID}' AND MONTH(T.DateAdded) = ${month} AND YEAR(T.DateAdded) = ${year}
    GROUP BY U.Name
    ORDER BY U.ID
  `)
}