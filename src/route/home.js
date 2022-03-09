const express = require('express');
const router = express.Router();
const home = require('../app/controller/homeController');

            //==== HIEU =======
            router.post('/order',home.storeOrder); // Tạo đơn hàng với các dữ kiện body : addressOrder,hotenOrder,sdtOrder,noteOrder,payment,priceTotal,
                                //    listProductOrder,priceCharge,priceCoupon,nameCoupon,statusOrder (statusOrder khởi tạo mặc định "pending"),

            router.post('/sendMail',home.sendMail); // gửi mail đến người dùng với các dữ kiện body : name,mail,address,priceTotal,idOrder
                                                    //(lưu ý thuộc tính idOrder(dạng chuỗi) kh phải thuộc tính _id loại ObjectId của Order).  
                                                    
            router.post('/create_payment_url',home.create_payment_url); // API của trang web thanh toán online.
            router.get('/getProduct',home.getProduct);  // trả về thông tin chi tiết sản phẩm với query là id
            router.get('/vnpay_return',home.vnpay_return); // API trang giao diện của trang web thanh toán online.

            //==== DUY =======
            router.get('/getOrder',home.getOrder); // trả thông tin đơn hàng với query là id 
            router.get('/getProducts/',home.getProducts); // trả về danh sách sản phẩm
            //==== DANH =======
            router.get('/product/:slug',home.detailProduct); // tra về thông tin chi tiết sản phẩm với params là slug
            //==== DO =======
            router.get('/getCategories',home.getCategories); // trả về danh sách danh mục
            router.get('/getProductsInCategory/:slug',home.getProductsInCategory); // trả về danh sách các sản phẩm của 1 category nào đó với params là slug
            router.get('/news/',home.getPosts); // trả về danh sách tin tức
            router.get('/news/:slug',home.detailPost); // trả về chi tiết tin tức với params là slug
            router.get('/bestseller12',home.bestseller12); // trả về danh sách 12 sản phẩm best seller của quán
            router.get('/post8',home.post8); // trả về danh sách 8 bài viết của quán



module.exports = router; 