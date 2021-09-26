
const home = require('./home')
const manager = require('./manager')
const me = require('./me')
function route(app){
    app.use('/manager', manager);
    app.use('/me', me);
    app.use('/', home);
  
}

module.exports = route;