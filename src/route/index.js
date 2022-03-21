
const home = require('./home')
const manager = require('./manager')
const me = require('./me')
const cors = require("../resources/validate/api.cors");
function route(app){
    app.use('/manager', manager);
    app.use('/me', me);
    app.use('/', home);
  
}

module.exports = route;