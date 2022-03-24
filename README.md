# Cách cài đặt   :wrench:
 - Tải trực tiếp qua file .zip hoặc git clone về máy
 - Mở Visual Code chạy terminal gõ : **npm install** để cài đặt các package cần thiết
 - Chạy dòng lệnh **npm start** để khởi động sever
 - Truy cập vào đường dẫn local dưới terminal để sử dụng
##
- Trang web : [https://sever-coffeehouse.herokuapp.com/manager/login](https://sever-coffeehouse.herokuapp.com/manager/login) :pushpin:
## Sourcecode : :card_index_dividers:
- Folder src/app : chứa các file khởi tạo model và các controller xử lý
- Folder src/config/db : chứa file cấu hình,kết nối với databse.
- Folder src/resources : chứa các file giao diện (sccs,handlebars)
- Folder src/route : Định tuyến các tuyến đường cho trang web
## Hướng dẫn sử dụng ứng dụng bên Admin :clipboard: :
Vào trang quản lí  bằng cách đăng nhập (username: admin và password :1234)

1. ***Chức năng Danh mục*** :
    - Chọn thanh ngang (+) để thêm danh mục (tên và hình ảnh) cần quản lí (có thể thêm nhiều category)
    - Sửa danh mục (thay đổi hình ảnh hoặc tên )
    - Xóa danh mục (chỉ xóa được nếu không có bất kì sản phẩm nào bên trong)
    - Khi xóa danh mục, sẽ bị xóa cấp 1 và lưu vào thùng rác. Có thể hồi phục lại hoặc xóa vĩnh viễn.
    - Phía trên có thanh Search tìm kiếm danh mục đã thêm
2. ***Chức năng sản phẩm*** :
    - Thêm sản phẩm : Nhập thông tin sản phẩm (danh mục, tên, giá, hình ảnh, mô tả, size)
    - Danh sách :
      - Nhập danh mục có sản phẩm vừa thêm để hiển thị danh sách
      - Sửa thông tin sản phẩm (thay đổi danh mục ,tên ,... ) :memo:
      - Xóa thông tin sản phẩm
      - Khi xóa danh mục, sẽ bị xóa cấp 1 và lưu vào thùng rác. Có thể hồi phục lại hoặc xóa vĩnh viễn. 
      - Tìm kiếm sản phẩm 
3. ***Chức năng bài viết*** :
    - Thêm bài viết : Nhập thông tin bài viết (tiêu đề,hình ảnh,nội dung ), phần tiêu đề 
      bài viết không được trùng nhau.
    - Danh sách :
      - Hiển thị danh sách 
      - Sửa thông tin bài viết (thay đổi tiêu đề ,hình ảnh ,... )
      - Xóa thông tin bài viết :wastebasket:
      - Khi xóa danh mục, sẽ bị xóa cấp 1 và lưu vào thùng rác. Có thể hồi phục lại hoặc xóa vĩnh viễn.
      - Tìm kiếm bài viết 
4. ***Chức năng đơn hàng*** :
    - Thời gian thực so với bên phía người sử dụng.Khi khách hàng chọn đặt hàng phía bên  admin sẽ ngay lập tức nhận thấy đơn hàng mà không cần phải reload lại trang .
    -  Với Đơn hàng mới sau khi liên lạc với khách hàng và admin sẽ xét duyệt đơn hàng thành công hay thất bại.
    - Đơn hàng sẽ luôn trong trạng thái đang chờ khi hoàn thành xác nhận , thay đổi trạng thái thì đơn hàng sẽ qua bên phía đã hoàn thành(admin lúc này chỉ xem được).
5. ***Bên trang Dashboard*** :
    - Tổng quan :
        - Tổng số sản phẩm ,tổng danh mục :mag:
        - Đơn hàng bán được trong ngày (chỉ tính các đơn ở trạng thái done).
        - Đơn hàng đã hủy  
        - Biểu đồ thể hiện 3 sản phẩm bán chạy nhất trong ngày (chỉ tính các đơn ở trạng thái done). :bar_chart:
6. ***Các API cho trang Client : ***
        - /order : (POST) Tạo đơn hàng với các dữ kiện body  : addressOrder,hotenOrder,sdtOrder,noteOrder,payment,priceTotal,listProductOrder,priceCharge,priceCoupon,nameCoupon,statusOrder (statusOrder khởi tạo mặc định "pending"),
        - /sendMail : (POST) gửi mail đến người dùng với các dữ kiện body  : name,mail,address,priceTotal,idOrder (lưu ý thuộc tính idOrder(dạng chuỗi) kh phải thuộc tính _id loại ObjectId của Order.                                                      
        - /create_payment_url : (POST) API của trang web thanh toán online với dữ kiện body : address,idOrder,priceTotal,name.
        - /getProduct : (GET) trả về thông tin chi tiết sản phẩm với query là id
        - /getOrder : (GET) trả thông tin đơn hàng với query là id 
        - /getProducts : (GET) trả về danh sách sản phẩm
        - /product/:slug : (GET) trả về thông tin chi tiết sản phẩm với params là slug
        - /getCategories : (GET) trả về danh sách danh mục
        - /getProductsInCategory/:slug : (GET) trả về danh sách các sản phẩm của 1 category nào đó với params là slug
        - /news : (GET) trả về danh sách tin tức
        - /news/:slug' : (GET) trả về chi tiết tin tức với params là slug
        - /bestseller12 : (GET) trả về danh sách 12 sản phẩm best seller của quán
        - /post8 : (GET) trả về danh sách 8 bài viết của quán
## Lưu ý :
 Khi có đường dẫn admin/category , chưa đăng nhập vẫn bị redirect về trang đăng nhập. (sử dụng jwt kiểm tra token)
