var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Goods = require("../models/goods");
var bodyParser = require("body-parser");

mongoose.connect("mongodb://127.0.0.1:27017/Mall");
mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success");
});
mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail");
});
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB disconnected");
});
// 商品查询
router.get("/list", function (req, res, next) {
  // res.send('hello goods list')
  //第几页
  let page = parseInt(req.param("page"));
  // 一页几个通过parma 解析url地址中的参数得来
  let pageSize = Number(req.param("pageSize"));
  // 排序的值
  let sort = req.param("sort");
  let skip = (page - 1) * pageSize;
  let params = {};
  // 价格传递参数
  let priceLevel = req.param("priceLevel");
  let priceGt = "",
    priceLte = "";
  if (priceLevel != "all") {
    switch (priceLevel) {
      case "0":
        priceGt = 0;
        priceLte = 500;
        break;
      case "1":
        priceGt = 500;
        priceLte = 1000;
        break;
      case "2":
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    };
  }
  let goodsMouel = Goods.find(params)
    .skip(skip)
    .limit(pageSize);
  goodsMouel.sort({
    salePrice: sort
  });
  goodsMouel.exec({}, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
    } else {
      res.json({
        status: "1",
        msg: "",
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});
// 加入购物车路由
router.post("/addCart", function (req, res, next) {
  var User = require("../models/user");
  var userId = req.cookies.userId,
    productId = req.body.productId;
  // console.log(productId);
  User.findOne({
      userId: userId
    },
    function (err, userDoc) {
      if (err) {
        res.json({
          status: "1",
          msg: err.message
        });
        console.log(err.message);
      } else {
        if (userDoc) {
          let goodsItem = "";
          userDoc.cartList.forEach(function (item) {
            if (item.productId == productId) {
              goodsItem = item;
              item.productNum++;
            }
          });
          if (goodsItem) {
            userDoc.save(function (err2, doc2) {
              if (err2) {
                res.json({
                  status: "1",
                  msg: err2.message
                });
                console.log(err2.message);
              } else {
                res.json({
                  status: "0",
                  msg: "",
                  result: "suc"
                });
              }
            });
          } else {
            Goods.findOne({
                productId: productId
              },
              function (err1, doc) {
                if (err1) {
                  res.json({
                    status: "1",
                    msg: err1.message
                  });
                  // console.log(err1.message);
                } else {
                  if (doc) {
                    // var obj = doc.toO;
                    doc.productNum = 1;
                    doc.checked = "1";
                    userDoc.cartList.push(doc);
                    userDoc.save(function (err2, doc2) {
                      if (err2) {
                        res.json({
                          status: "1",
                          msg: err2.message
                        });
                        console.log(err2.message);
                      } else {
                        res.json({
                          status: "0",
                          msg: "",
                          result: "suc"
                        });
                      }
                    });
                  }
                }
              }
            );
          }
        }
      }
    }
  );
});
//加入到购物车
module.exports = router;
