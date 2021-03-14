const db = require('../utils/database');

module.exports = {

  getDataForBarChart: (userID, month, year) => db.load(`
    SELECT IF(E.Money >= 0, 'Thu', 'Chi') AS Title, SUM(E.Money) AS Money
    FROM Exchanges E JOIN Users U ON U.ID = E.UserID
    WHERE U.ID = '${userID}' AND MONTH(E.DateAdded) = ${month} AND YEAR(E.DateAdded) = ${year}
    GROUP BY Title
  `),

  getDataForPieChart: (userID, month, year, isSpent) => db.load(`
    SELECT
      ET.Name,
      SUM(CASE
        WHEN ${isSpent} = TRUE AND E.Money < 0 THEN E.Money
        WHEN ${isSpent} = FALSE AND E.Money >= 0 THEN E.Money 
        ELSE 0 END
      ) AS Money
    FROM Exchanges E JOIN Users U ON U.ID = E.UserID JOIN ExchangeTypes ET ON ET.ID = E.ExchangeTypeID
    WHERE U.ID = '${userID}' AND MONTH(E.DateAdded) = ${month} AND YEAR(E.DateAdded) = ${year}
    GROUP BY ET.Name
  `)

}