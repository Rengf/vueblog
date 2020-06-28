var express = require('express');
// 加载数据库管理模块
var mongoose = require('mongoose');
// 加载body-parser用来处理post提交过来的数据
var bodyParser = require('body-parser');
// 加载cookies模块
var Cookies = require('cookies');
var path = require('path');
var history = require('connect-history-api-fallback');
// var cors = require('cors');
// 创建app应用
var app = express();
// app.use(cors());

var User = require('./models/user.js');
// app.use(history())
// app.set('views', path.join(path.resolve(__dirname, '../'), 'dist'))
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'ejs');
// //app.use(history()) // 这里千万要注意，要在static静态资源上面
app.use(express.static(path.join(__dirname, 'dist')));
// 配置body-parser 配置好后就可以通过request的body属性获取数据了
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({
  uploadDir: '/images/',
  keepExtensions: true,
  limit: '50mb'
}));
//在原有的基础上加上下面代码即可
app.use(bodyParser.json())
// 配置cookies
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8085');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  req.cookies = new Cookies(req, res);
  // 解析用户登录的信息
  req.userInfo = {};
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));
      // 获取当前登录用户的类型:是否是管理员

      User.findById(req.userInfo._id).then(function (userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
        next();
      })
    } catch (e) {
      next();
    }
  } else {
    next();
  }
})

/*
 * 根据不同的功能划分模块(路由分块)
 *
 * */
app.use('/admin', require('./router/admin'));
app.use('/api', require('./router/api'));
app.use('/', require('./router/main'));


mongoose.connect("mongodb://localhost:27017/vueblog", function (err) {
  if (err) {
    console.log("数据库连接失败");
  } else {
    console.log("数据库连接成功");
    app.listen(3000)
  }
});
