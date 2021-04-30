const db = require('../utils/database');

module.exports = {

  getDataForBarChart: (userID, month, year) => db.load(`
    SELECT IF(T.Money >= 0, 'Thu', 'Chi') AS Title, SUM(T.Money) AS Money
    FROM Transactions T JOIN Users U ON U.ID = T.UserID
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
    FROM Transactions T JOIN Users U ON U.ID = T.UserID JOIN Categories Cat ON Cat.ID = T.CategoryID
    WHERE U.ID = '${userID}' AND MONTH(T.DateAdded) = ${month} AND YEAR(T.DateAdded) = ${year}
    GROUP BY Cat.Name
  `)

}