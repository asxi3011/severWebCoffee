const Category = require("../model/category");
const Product = require("../model/product");
const Order = require("../model/order");
const Post = require("../model/post");
const { doc, updateDoc } = require("firebase/firestore");
const db = require("../../../Firebase/config");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const multer = require("multer");
const storeage = multer.diskStorage({
  destination: "src/public/uploads",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({
  storage: storeage,
});
const uploadProduct = upload.single("imageProduct");
const uploadPost = upload.single("imagePost");
const uploadCategory = upload.array("imageCategory");
const uploadCategorySingle = upload.single("imageCategory");
class meControllers {
  // Category > Item Category > Product
  //Bin Category
  binCategory(req, res, next) {
    Category.findDeleted()
      .lean()
      .sort({ deletedAt: -1 })
      .then((data) => {
        res.render("adminPage/PageCategorys/bin", {
          layout: "admin",
          data: data,
        });
      })
      .catch((err) => {
        res.render("partials/SomeThingWrong", { err: err });
      });
  }
  restoreCategory(req, res, next) {
    Category.restore({ _id: req.params.id }, function (err) {
      Product.restore({ idCategory: req.params.id }, function (err) {
        if (err) {
          res.render("partials/SomeThingWrong", { err: err });
        } else {
          res.redirect("back");
        }
      });
    });
  }
  deleteOutBinCategory(req, res, next) {
    Category.findByIdAndDelete({ _id: req.params.id }, function (err) {
      if (err) {
        res.render("partials/SomeThingWrong", { err: err });
      } else {
        res.redirect("back");
      }
    });
  }
  //Page Category
  Category(req, res, next) {
    Promise.all([Category.find().lean(), Category.countDocumentsDeleted()])
      .then(([data, numTrash]) => {
        res.render("adminPage/PageCategorys/home", {
          layout: "admin",
          data: data,
          numTrash: numTrash,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound", { layout: "admin" });
      });
  }
  storeCategory(req, res, next) {
    uploadCategory(req, res, function (err) {
      if (err) {
        res.render("partials/SomeThingWrong", { err: err });
      } else {
        var arrayImage = req.files;
        var arrayNameCategory = req.body.nameCategory;
        var arrayCateogry = [];
        arrayNameCategory.forEach((element, index) => {
          var category = new Category({
            nameCategory: normalization(element),
            imageCategory: arrayImage[index].filename,
            slug: ChangeToSlug(element),
          });
          arrayCateogry.push(category);
        });
        Category.insertMany(arrayCateogry, function (err) {
          if (err) {
            res.render("partials/SomeThingWrong", { err: err });
          } else {
            res.redirect("back");
          }
        });
      }
    });
  }
  editCategory(req, res, next) {
    var id = req.params.id;
    Category.findById({ _id: id })
      .lean()
      .then((data) => {
        res.render("adminPage/PageCategorys/edit", {
          layout: "admin",
          data: data,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound", { layout: "admin" });
      });
  }
  updateCategory(req, res, next) {
    uploadCategorySingle(req, res, function (err) {
      var idCategory = req.body.idCategory;
      var nameCategory = req.body.nameCategory;
      var file = req.file.filename;
      if (req.file) {
        Category.findByIdAndUpdate(
          { _id: idCategory },
          {
            $set: {
              nameCategory: normalization(nameCategory),
              imageCategory: file,
            },
          },
          function (err) {
            if (err) {
              res.render("partials/SomeThingWrong", { err: err });
            } else {
              res.redirect("./category");
            }
          }
        );
      } else {
        Category.findByIdAndUpdate(
          { _id: idCategory },
          { $set: { nameCategory: normalization(nameCategory) } },
          function (err) {
            if (err) {
              res.render("partials/SomeThingWrong", { err: err });
            } else {
              res.redirect("./category");
            }
          }
        );
      }
    });
  }
  removeCategory(req, res, next) {
    Category.delete({ _id: req.params.id }, function (err) {
      if (err) {
        res.render("partials/SomeThingWrong", { err: err });
      } else {
        Product.delete({ idCategory: req.params.id }, function (err) {
          if (err) {
            res.json(err);
          } else {
            res.redirect("back");
          }
        });
      }
    });
  }

  //Product
  Product(req, res, next) {
    Category.find()
      .lean()
      .then((data) => {
        res.render("adminPage/PageProducts/add", {
          layout: "admin",
          dataCategory: data,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound");
      });
  }
  getProducts(req, res, next) {
    var idCategory = req.params.id;
    Category.findOne({ _id: idCategory })
      .lean()
      .then((data) => {
        Product.findWithDeleted({ idCategory: data._id })
          .lean()
          .then((data) => {
            var arrayDeleted = data.filter(
              (element) => element.deleted == true
            ); // các phần tử dã bị xóa
            var arrayNotDeleted = data.filter(
              (element) => element.deleted == false
            ); // các phần tử chưa xóa
            res.json({
              dataProduct: arrayNotDeleted,
              dataCount: arrayDeleted.length,
            });
          })
          .catch(() => {
            res.json({ status: 404, msg: "Không tìm thấy dữ liệu product" });
          })
          .catch(() => {
            res.json({ status: 404, msg: "Không tìm thấy dữ liệu category" });
          });
      })
      .catch((err) => {
        res.json({ status: 404, err: err });
      });
  }
  listProduct(req, res, next) {
    Category.find()
      .lean()
      .then((data) => {
        res.render("adminPage/PageProducts/home", {
          layout: "admin",
          dataCategory: data,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound");
      });
  }
  storeProduct(req, res, next) {
    uploadProduct(req, res, async function (err) {
      var idCategory = req.body.Category;
      var nameProduct = normalization(req.body.nameProduct);
      var PriceRoot = req.body.PriceRoot;
      var productDescription = req.body.productDescription;
      var listSize = req.body.listSize;
      var listPriceExtra = req.body.listPriceExtra;
      var slug = ChangeToSlug(normalization(nameProduct));
      let newsize = await listSize.map((size, index) => {
        return { name: size, value: listPriceExtra[index] };
      });
      console.log(1);
      console.log(newsize);
      try {
        var newProduct = new Product({
          nameProduct: nameProduct,
          priceStandard: parseFloat(PriceRoot),
          idCategory: idCategory,
          descriptionProduct: productDescription,
          imageRepresent: req.file.filename,
          Size: newsize,
          slug,
        });
        newProduct.save(function (err) {
          if (err) {
            res.json({ err: 1, msg: "Lưu thất bại" });
          } else {
            res.redirect("back");
          }
        });
      } catch {
        res.json({ err: 1, msg: "Thông tin sai" });
      }
    });
  }
  removeProduct(req, res, next) {
    Product.delete({ _id: req.params.id }, function (err) {
      if (err) {
        res.render("partials/Pagenotfound", { layout: "admin" });
      } else {
        res.redirect("back");
      }
    });
  }
  updateProduct(req, res, next) {
    uploadProduct(req, res, async function (err) {
      if (req.file) {
        var idProduct = req.body.idProduct;
        var idCategory = req.body.Category;
        var nameProduct = normalization(req.body.nameProduct);
        var PriceRoot = req.body.PriceRoot;
        var productDescription = req.body.productDescription;
        var listSize = req.body.listSize;
        var status = req.body.status;
        var listPriceExtra = req.body.listPriceExtra;
        var slug = ChangeToSlug(normalization(nameProduct));
        let newsize = await listSize.map((size, index) => {
          return { name: size, value: listPriceExtra[index] };
        });
        try {
          Product.findByIdAndUpdate(
            { _id: idProduct },
            {
              nameProduct: nameProduct,
              idCategory: idCategory,
              priceStandard: PriceRoot,
              status: status, // ready : còn hàng //out: hết hàng
              Size: newsize,
              descriptionProduct: productDescription,
              imageRepresent: req.file.filename,
              slug: slug,
            },
            function (err) {
              if (err) {
                res.render("partials/Somethingwrong", { err: err });
              } else {
                res.redirect("/me/listProduct");
              }
            }
          );
        } catch {
          res.json({ err: 1, msg: "Thông tin sai" });
        }
      } else {
        var idProduct = req.body.idProduct;
        var idCategory = req.body.Category;
        var nameProduct = normalization(req.body.nameProduct);
        var PriceRoot = req.body.PriceRoot;
        var productDescription = req.body.productDescription;
        var listSize = req.body.listSize;
        var status = req.body.status;
        var listPriceExtra = req.body.listPriceExtra;
        var slug = ChangeToSlug(normalization(nameProduct));
        let newsize = listSize.map((size, index) => {
          return { name: size, value: listPriceExtra[index] };
        });
        try {
          Product.findByIdAndUpdate(
            { _id: idProduct },
            {
              nameProduct: nameProduct,
              idCategory: idCategory,
              priceStandard: PriceRoot,
              status: status, // ready : còn hàng //out: hết hàng
              Size: newsize,
              descriptionProduct: productDescription,
              slug: slug,
            },
            function (err) {
              if (err) {
                res.json(err);
              } else {
                res.redirect("/me/listProduct");
              }
            }
          );
        } catch {
          res.json({ err: 1, msg: "Thông tin sai" });
        }
      }
    });
  }
  editProduct(req, res, next) {
    Promise.all([
      Category.find().lean(),
      Product.findById({ _id: req.params.id }).lean(),
    ])
      .then(([dataCategory, dataProduct]) => {
        console.log("CC", dataProduct.Size);
        res.render("adminPage/PageProducts/edit", {
          layout: "admin",
          dataCategory: dataCategory,
          dataProduct: dataProduct,
          size: dataProduct.Size,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound", { layout: "admin" });
      });
  }
  //Bin Product
  binProduct(req, res, next) {
    Product.findDeleted({ idCategory: req.params.idCategory })
      .lean()
      .then((data) => {
        res.render("adminPage/PageProducts/bin", {
          layout: "admin",
          data: data,
          idCategory: req.params.idCategory,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound", { layout: "admin" });
      });
    // res.json(req.params.idItemCategory);
  }
  restoreProduct(req, res, next) {
    Product.restore({ _id: req.params.id }, function (err) {
      if (err) {
        res.render("partials/Somethingwrong", { err: err });
      } else {
        res.redirect("back");
      }
    });
  } // Xóa vĩnh viễn thùng rác
  deleteOutBinProduct(req, res, next) {
    var idCategory = req.params.idCategory;
    var idProduct = req.params.id;
    Product.findByIdAndDelete({ _id: idProduct }, function (err) {
      if (err) {
        res.render("partials/Somethingwrong", { err: err });
      } else {
        res.redirect("back");
      }
    });
  }
  //Order
  listOrder(req, res, next) {
    Order.find({})
      .lean()
      .sort({ createdAt: -1 })
      .then((data) => {
        res.render("adminPage/Order/listOrder", {
          layout: "admin",
          data: data,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound", { layout: "admin" });
      });
  }
  listOrderPending(req, res, next) {
    var status = req.params.status;
    var query = req.query.q;
    if (query === "today") {
      var start = new Date();
      start.setHours(0, 0, 0, 0);
      var end = new Date();
      end.setHours(23, 59, 59, 999);
      Order.find({
        $and: [
          { createdAt: { $gte: start, $lt: end } },
          { statusOrder: status },
        ],
      })
        .lean()
        .sort({ createdAt: -1 })
        .then((data) => {
          res.render("adminPage/Order/listOrder", {
            layout: "admin",
            data: data,
          });
        })
        .catch(() => {
          res.render("partials/Pagenotfound", { layout: "admin" });
        });
    } else {
      if (status === "inprogress") {
        Order.find({
          $or: [
            { statusOrder: status },
            { statusOrder: "Đã thanh toán VNPay" },
          ],
        })
          .lean()
          .sort({ createdAt: -1 })
          .then((data) => {
            res.render("adminPage/Order/listOrder", {
              layout: "admin",
              data: data,
            });
          })
          .catch(() => {
            res.render("partials/Pagenotfound", { layout: "admin" });
          });
      } else {
        Order.find({ statusOrder: status })
          .lean()
          .sort({ createdAt: -1 })
          .then((data) => {
            res.render("adminPage/Order/listOrder", {
              layout: "admin",
              data: data,
            });
          })
          .catch(() => {
            res.render("partials/Pagenotfound", { layout: "admin" });
          });
      }
    }
  }
  activeDonHang(req, res, next) {
    var id = req.body.id;
    var status = req.body.status;
    var price = req.body.price;
    var docID = req.body.docID;
    Order.findByIdAndUpdate(
      { _id: id },
      { $set: { statusOrder: status } },
      function (err) {
        if (err) {
          res.json(err);
        } else {
          if(docID){
            try {
              const action = async () => {
                const docRef = db.collection("users").doc(docID);
                const info = await docRef.get();
                const scoreNow = info._fieldsProto.score.integerValue;
                const res = await docRef.update({
                  score: Number(scoreNow) + Math.floor(Number(price) / 10000),
                });
                return res;
              };
              console.log("RUNNNING CONG DIEM NE")
              action();
  
              res.json("success");
            } catch (e) {
              console.log(e);
            }
          }else{
            res.json("success");
          }
         
        }
      }
    );
  }
  detailsOrder(req, res, next) {
    var id = req.params.id;
    Order.findById({ _id: id })
      .lean()
      .then((order) => {
        var listProductCart = order.listProductCart;
        console.log(order);
        res.render("adminPage/Order/detailsOrder", {
          layout: "admin",
          data: order,
          cartProduct: listProductCart,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound", { layout: "admin" });
      });
  }
  countOrderPending(req, res, next) {
    var status = "inprogress";
    Order.find({
      $or: [{ statusOrder: status }, { statusOrder: "Đã thanh toán VNPay" }],
    })
      .lean()
      .then((data) => {
        res.json(data.length);
      });
  }
  //dashboard
  dashboard(req, res, next) {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    var product = Product.find().lean();
    var category = Category.find().lean();
    var orderDone = Order.find({
      $and: [{ createdAt: { $gte: start, $lt: end } }, { statusOrder: "done" }],
    }).lean();
    var orderCancel = Order.find({
      $and: [
        { createdAt: { $gte: start, $lt: end } },
        { statusOrder: "cancel" },
      ],
    }).lean();
    Promise.all([product, category, orderDone, orderCancel])
      .then(([product, category, orderDone, orderCancel]) => {
        res.render("adminPage/dashboard", {
          layout: "admin",
          product: product.length,
          category: category.length,
          orderDone: orderDone.length,
          orderCancel: orderCancel.length,
        });
      })
      .catch(() => {
        res.render("partials/Pagenotfound", { layout: "admin" });
      });
  }

  getChartToDay(req, res, next) {
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    Order.find({
      $and: [{ createdAt: { $gte: start, $lt: end } }, { statusOrder: "done" }],
    })
      .lean()
      .then((data) => {
        var listFinal = []; // mảng cuối cùng , mảng gửi thông tin cho người dùng
        data.forEach((order) => {
          // từng đơn hàng
          var productCart = order.listProductCart; // đơn hàng có nhiều sản phẩm trong giỏ hàng
          productCart.forEach((element) => {
            for (var i = 1; i <= element.quantities; i++) {
              listProductToday.push(element.nameProduct);
            }
          });
          console.log("HERE",productCart);
        });
        var listUnitProductToday = unique(listProductToday); // x lúc này chứa các mảng tên nhưng không bị trùng lặp
        listUnitProductToday.forEach((element) => {
          // hàm này đếm chuẩn xác tên sản phẩm có bao nhiêu số lượng mua
          var count = 0;
          nameProduct.forEach((elementProduct) => {
            if (elementProduct === element) {
              count++;
            }
          });
          listFinal.push({ name: element, quantity: count });
        });
        res.json(listFinal);
      })
  }
  //Bài Viết
  post(req, res, next) {
    res.render("adminPage/Post/add", { layout: "admin" });
  }
  storePost(req, res, next) {
    uploadPost(req, res, function (err) {
      if (err) {
        res.render("partials/Somethingwrong", { err: err });
      } else {
        var title = normalization(req.body.postTitle);
        var image = req.file.filename;
        var content = req.body.content;
        var slug = ChangeToSlug(title);
        var post = new Post({
          title,
          image,
          content,
          slug,
        });
        post.save(function (err) {
          if (err) {
            res.json(err);
          } else {
            res.redirect("back");
          }
        });
      }
    });
  }
  listPost(req, res, next) {
    Post.find()
      .lean()
      .then((data) => {
        res.render("adminPage/Post/home", { layout: "admin", dataPost: data });
      })
      .catch(() => {
        res.render("partials/Pagenotfound");
      });
  }
  editPost(req, res, next) {
    var id = req.params.id;
    Post.findById({ _id: id })
      .lean()
      .then((data) => {
        res.render("adminPage/Post/edit", { layout: "admin", post: data });
      })
      .catch(() => {
        res.render("partials/Pagenotfound", { layout: "admin" });
      });
  }
  updatePost(req, res, next) {
    uploadPost(req, res, function (err) {
      if (err) {
        res.render("partials/Somethingwrong", { err: err });
      } else {
        if (req.file) {
          var idPost = req.body.idPost;
          var title = normalization(req.body.postTitle);
          var image = req.file.filename;
          var content = req.body.content;
          var slug = ChangeToSlug(title);
          Post.findByIdAndUpdate(
            { _id: idPost },
            { image: image, title: title, slug: slug, content: content },
            function (err) {
              if (err) {
                res.json(err);
              } else {
                res.redirect("/me/listPost");
              }
            }
          );
        } else {
          var idPost = req.body.idPost;
          var title = normalization(req.body.postTitle);

          var content = req.body.content;
          var slug = ChangeToSlug(title);
          Post.findByIdAndUpdate(
            { _id: idPost },
            { title: title, slug: slug, content: content },
            function (err) {
              if (err) {
                res.json(err);
              } else {
                res.redirect("/me/listPost");
              }
            }
          );
        }
      }
    });
  }
  deletePost(req, res, next) {
    Post.findByIdAndDelete({ _id: req.params.id })
      .lean()
      .then((data) => {
        res.redirect("back");
      })
      .catch((err) => {
        res.render("partials/SomeThingWrong", { err: err });
      });
  }
}
function ChangeToSlug(input) {
  var slug;
  const formName = input.replace(/\s+/g, " ");
  slug = formName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .split(" ")
    .join("-");
  return slug;
}
function normalization(string) {
  var stringLowcase = string.toLowerCase();
  var stringTrim = stringLowcase.replace(/\s+/g, " ");
  return stringTrim;
}
function unique(arr) {
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (newArr.indexOf(arr[i]) === -1) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
module.exports = new meControllers();
