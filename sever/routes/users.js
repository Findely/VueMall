var express = require("express");
var router = express.Router();
require('./../util/util');
var User = require("./../models/user");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/login", function (req, res, next) {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message
      });
      console.log("错误");
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: "/",
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: "/",
          maxAge: 1000 * 60 * 60
        });
        // req.session.user = doc;
        res.json({
          status: "0",
          msg: "",
          result: {
            userName: doc.userName
          }
        });
        // console.log(doc)
      }
    }
  });
});

// 登出接口
router.post('/logout', function (req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})
// 自动登录接口
router.get('/checklogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: "",
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: "未登录",
      result: ''
    })
  }
})
//c 
router.get('/getCartCount', function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    var userId = req.cookies.userId;
    User.findOne({
      userId: userId
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        var cartList = doc.cartList;
        var cartCoun = 0;
        cartList.map(function (item) {
          cartCoun += parseInt(item.productNum)
        });
        res.json({
          status: '0',
          msg: '',
          result: cartCoun
        })
      }
    })

  }


})

//查询用户购物车
router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ""
      })
    } else {
      if (doc) {
        doc.cartList;
        res.json({
          status: "0",
          msg: "成功",
          result: doc.cartList
        })
      } else {
        res.json({
          status: "0",
          msg: "",
          result: ''
        })
      }
    }
  })
})
// 删除数据
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  User.update({
      userId: userId
    }, {
      $pull: {
        cartList: {
          productId: productId
        }
      }
    },
    function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    })
})
//更新数量
router.post('/cartEdit', function (req, res, next) {
  var userId = req.cookies.userId;
  var productId = req.body.productId;
  var productNum = req.body.productNum;
  var checked = req.body.checked;
  User.update({
    userId: userId,
    "cartList.productId": productId
  }, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: 'suc'
      })
    }
  })
})
// 购物车修改
router.post('/editCheckAll', function (req, res, next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll;
  User.findOne({
    userId: userId
  }, function (err, user) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach((element) => {
          element.checked = checkAll;
        });
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            })
            console.log(doc)
          }
        })
      }
    }
  })
})
//  查询接口
router.get('/address', function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: "0",
        msg: '',
        result: doc.addressList
      })
    }
  })
})
//设置默认地址接口
router.post('/Setdefault', function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  if (!addressId) {
    // res.json({
    //   status: '1003',
    //   msg: '没有传',
    //   result: ''
    // })
    console.log('没有传')
  }
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var addressList = doc.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
      console.log(doc)
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          })
        }
      })
    }
  })
})
// 删除地址
router.post('/delAddress', function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.update({
    userId: userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
})
router.post('/payMent', function (req, res, next) {
  var userId = req.cookies.userId,
    orderTotal = req.body.orderTotal,
    addressId = req.body.addressId;
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      // 获取地址
      var address = '',
        goodsList = [];
      doc.addressList.forEach((item) => {
        if (item.addressId == addressId) {
          address = item
        }
      })
      // 获取用户购买商品
      doc.cartList.forEach((item) => {
        if (item.checked == '1') {
          goodsList.push(item)
        }
      });
      var platfrom = '622';
      var r1 = Math.floor(Math.random() * 10)
      var r2 = Math.floor(Math.random() * 10)
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var creatDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platfrom + r1 + sysDate + r2;
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        goodsList: goodsList,
        addressInfo: address,
        orderStatus: "1",
        createDate: creatDate
      }
      doc.orderList.push(order);
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
          // console.log(order.orderTotal)
        }
      })

    }
  })
})
// 根据订单id查询订单
router.get('/orderDetail', function (req, res, next) {
  var userId = req.cookies.userId,
    orderId = req.param("orderId");
  User.findOne({
    userId: userId
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var orderList = doc.orderList;
      if (orderList.length > 0) {
        var orderTotal = 0;
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        })
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        } else {
          res.json({
            status: '12',
            msg: '',
            result: ''
          })
        }

      } else {
        res.json({
          status: '1',
          msg: '没有此订单',
          result: ''
        })
      }
    }
  })
})
module.exports = router;
