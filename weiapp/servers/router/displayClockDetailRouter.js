let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let requireAuth = require('./requireAuth');
let Clock = require('../models/clock');
let User = require('../models/user');
router.use('/', requireAuth, function (req, res, next) {
    console.log(req.query.id);
    let flag = false;//判断今天是否签到过了
    let date = getNowFormatDate();//当前日期
    let clocksDetail = [];
    let userSignIn = [];
    Clock.findOne({id: req.query.id}, (err, clock) => {
        if (err) {
            return console.log(err);
        }
        let sumDay= getDays(clock.beginDate, clock.endDate);
        let lastDay=getDays(date,clock.endDate);
        if(sumDay-lastDay<0){
            lastDay=0;
        }
        clocksDetail.push({
            id: clock.id,
            name: clock.name,
            image: clock.image,
            owner: clock.owner,
            detail: clock.detail,
            clockDetail: clock.clockDetail,
            beginDate: clock.beginDate,
            endDate: clock.endDate,
            length: clock.user.length,
            sumDay:sumDay,
            lastDay:sumDay-lastDay
        });
        User.findOne({openid: req.openid}, (err, user) => {
            if (err) {
                return console.log(err);
            }
            for (let item of user.clocks) {
                if (item.id.toString() === req.query.id.toString()) {
                    console.log("come in");
                    for (let signDate of item.signInDate) {
                        if (signDate.date === date) {
                            flag = true;
                        }
                    }
                }
            }
            return res.json({
                clock: clocksDetail,
                flag: flag
            })
        });
    });


});

//格式化日期
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//计算天数
function getDays(s1, s2) {
    let day1 = s1.split("-");
    let day2 = s2.split("-");
    let startDate = new Date(day1[0], day1[1]-1, day1[2]);
    let endDate = new Date(day2[0], day2[1]-1, day2[2]);
    return parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24) + 1;
}

module.exports = router;