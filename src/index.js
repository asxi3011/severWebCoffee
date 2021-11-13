const express = require('express')
const exphbs  = require('express-handlebars');
const path = require('path');
const port = process.env.PORT; //heoroku port
const route = require('./route/index.js')
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser')
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })

const app = express();


app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.set('views',(path.join(__dirname,'resources/views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())


const db = require('./config/db');
db.connect();

app.engine('.hbs', exphbs(
  {extname:".hbs",
  helpers: {
    inc: function (index) { return index+1; },
    checkStatus: function (status) {
        if(status === 'pending'){
          return "d-inline-block";
        }
        else{
          return "d-none";
        }
    }
}}
  
));



app.use(methodOverride('_method'));
app.set('view engine', '.hbs');
route(app);
app.listen(3030, () => {
  console.log(`Example app listening at http://localhost:3000`)
})