const url = '127.0.0.1';
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require('morgan');
const app = express();

app.use(bodyParser.json());//json
app.use(morgan('dev'));//log

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${url}:27017/user`);
//判断数据库是否能正常启动
let db = mongoose.connection;
db.on('error', console.log);
db.once('open', function () {
    console.log('success!')
});


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//访问静态资源图片
app.use(express.static(path.join(__dirname, './upload')));

//查询星座接口
let signRouter = require('./router/signRouter');
app.use('/sign', signRouter);

//聊天机器人接口
let robotRouter = require('./router/robotRouter');
app.use('/robot', robotRouter);

//上传图片到服务器
let imageRouter = require('./router/uploadImages');
app.use('/study', imageRouter);

//上传照片到服务器
let photoRouter = require('./router/uploadPhotoRouter');
app.use('/photo', photoRouter);

//展示图片信息到页面
let displayStudyItemsRouter = require('./router/displayStudyItemsRouter');
app.use('/study', displayStudyItemsRouter);

//保存用户信息
let getUserSession = require('./router/getUserSession');
app.use('/wx', getUserSession);

//展示单独图片信息到页面
let displayStudyDetail = require('./router/displayStudyDetail');
app.use('/detail', displayStudyDetail);

//删除我的背书内容
let getUser = require('./router/deleteStudyItems');
app.use('/deleteStudyItems', getUser);

//展示我加入的打卡
let displayMyClockRouter = require('./router/displayMyClockRouter');
app.use('/myClock', displayMyClockRouter);

//展示我每天的打卡记录
let displayMyClockRecordRouter = require('./router/displayMyClockRecordRouter');
app.use('/myClockRecord', displayMyClockRecordRouter);

//展示所有打卡
let displayAllClockRouter = require('./router/displayAllClockRouter');
app.use('/clockList', displayAllClockRouter);

//查找某个打卡的具体内容
let displayClockDetailRouter = require('./router/displayClockDetailRouter');
app.use('/clockItem', displayClockDetailRouter);

//加入某个打卡
let joinClockRouter = require('./router/joinClockRouter');
app.use('/joinClock', joinClockRouter);

//打卡
let checkClockRouter = require('./router/checkClockRouter');
app.use('/checkClock', checkClockRouter);

// 监听端口，等待连接
const port = 8080;
app.listen(port);

// 输出服务器启动日志
console.log(`Server listening at http://${url}:${port}`);