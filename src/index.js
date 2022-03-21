const express = require('express')
const exphbs  = require('express-handlebars');
const path = require('path');
const port = process.env.PORT || 3030; //heoroku port
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


const server = require('http').Server(app);
const io = require('socket.io')(server);
const db = require('./config/db');
io.on('connection', (socket) => {
  socket.on('don-hang-moi',(data)=>{
    console.log(data);
    io.sockets.emit("nhan-don-hang","ok");
  });
});
db.connect();
app.engine('.hbs', exphbs(
  {extname:".hbs",
  helpers: {
    inc: function (index) { return index+1; },
    checkStatus: function (status) {
        if(status === 'inprogress' || status === "Đã thanh toán VNPay"){
          return "d-inline-block";
        }
        else{
          return "d-none";
        }
    },
    checkColorStatus:function(status){
      switch(status){
        case "inprogress":
           return '#fb8f19';
           break;
        case "done":
          return 'green';
           break;
        case "Đã thanh toán VNPay":
          return '#2aceeb';
          break;
        default:
          return 'red';
      }
    },
    formatNum: function (num){
      return num.toLocaleString("en-US")+" ₫";
    },
    formatDate: function (date){
      return date.toLocaleString("en-US");
    },
    formatDateShort: function (date){
      return date.toLocaleString("en-US",{dateStyle:"medium"});
    },
    checkCodeVNPay: function(code){
      switch(code){
        case "00": 
            return "text-success";
            break;
        default:
            return "text-danger";
      }
    },
    checkMessageVNPay: function(code){
      switch(code){
        case "00": 
            return "Giao dịch được thực hiện thành công. Cảm ơn quý khách đã sử dụng dịch vụ";
            break;
        case "24": 
            return "Giao dịch không thành công do: Khách hàng hủy giao dịch";
            break;
        default:
            return "Giao dịch không thành công";
      }
    }

  
}}
));
app.use(methodOverride('_method'));
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});
app.set('view engine', '.hbs');
route(app);
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:3030`)
})