const express = require('express')
const exphbs  = require('express-handlebars');
const path = require('path');
const port = process.env.PORT; //heoroku port
const route = require('./route/index.js')

const app = express()
 
app.get('/', function (req, res) {
  res.render('home');
})
app.use(express.urlencoded({extended: true}))
app.use(express.json());
route(app);
const db = require('./config/db');
db.connect();

app.engine('.hbs', exphbs(
  {extname:".hbs"}
));
app.set('view engine', '.hbs');
app.set('views',(path.join(__dirname,'resources/views')));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`)
})