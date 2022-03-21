const express = require('express');
const router = express.Router();
const cors = require("../resources/validate/api.cors");
const home = require('../app/controller/homeController');

            //==== HIEU =======
            router.post('/order',cors.setHeader,home.storeOrder); // Tạo đơn hàng với các dữ kiện body : addressOrder,hotenOrder,sdtOrder,noteOrder,payment,priceTotal,
                                //    listProductOrder,priceCharge,priceCoupon,nameCoupon,statusOrder (statusOrder khởi tạo mặc định "pending"),

            router.post('/sendMail',cors.setHeader,home.sendMail); // gửi mail đến người dùng với các dữ kiện body : name,mail,address,priceTotal,idOrder
                                                    //(lưu ý thuộc tính idOrder(dạng chuỗi) kh phải thuộc tính _id loại ObjectId của Order).  
                                                    
            router.post('/create_payment_url',cors.setHeader,home.create_payment_url); // API của trang web thanh toán online.
            router.get('/getProduct',cors.setHeader,home.getProduct);  // trả về thông tin chi tiết sản phẩm với query là id
            router.get('/vnpay_return',cors.setHeader,home.vnpay_return); // API trang giao diện của trang web thanh toán online.

            //==== DUY =======
            router.get('/getOrder',cors.setHeader,home.getOrder); // trả thông tin đơn hàng với query là id 
            router.get('/getProducts/',cors.setHeader,home.getProducts); // trả về danh sách sản phẩm
            //==== DANH =======
            router.get('/product/:slug',cors.setHeader,home.detailProduct); // tra về thông tin chi tiết sản phẩm với params là slug
            //==== DO =======
            router.get('/getCategories',cors.setHeader,home.getCategories); // trả về danh sách danh mục
            router.get('/getProductsInCategory/:slug',cors.setHeader,home.getProductsInCategory); // trả về danh sách các sản phẩm của 1 category nào đó với params là slug
            router.get('/news/',cors.setHeader,home.getPosts); // trả về danh sách tin tức
            router.get('/news/:slug',cors.setHeader,home.detailPost); // trả về chi tiết tin tức với params là slug
            router.get('/bestseller12',cors.setHeader,home.bestseller12); // trả về danh sách 12 sản phẩm best seller của quán
            router.get('/post8',cors.setHeader,home.post8); // trả về danh sách 8 bài viết của quán



module.exports = router; 