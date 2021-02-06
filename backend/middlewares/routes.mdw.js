const config = require('../config/default.json');

module.exports = (app) => {
    app.use('/', require('../routes/routes'));
}