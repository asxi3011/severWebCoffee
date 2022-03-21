
const home = require('./home')
const manager = require('./manager')
const me = require('./me')
const cors = require("../resources/validate/api.cors");
function route(app){
    app.use('/manager', manager);
    app.use('/me', me);
    app.use('/',cors.setHeader, home);
  
}

module.exports = route;