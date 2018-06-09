let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let Clock = require('../models/clock');
let requireAuth = require('./requireAuth');
router.use('/', requireAuth, function (req, res, next) {
    let exist = [];
    let clocks = [];
    let date = getNowFormatDate();//当前日期
    Clock.find((err, clock) => {
        if (err) {
            return console.log(err);
        }
        for (let item of clock) {
            let day = getDays(date, item.beginDate);
	    console.log(day+"!!");
            if (item.user.length === 0 && day <= 0) {
                exist.push(2);
            }else if(item.user.length === 0 && day > 0){
                exist.push(3);
            }
            for (let user of item.user) {
                if (user.openid === req.openid && day <= 0) {
                    exist.push(1);
                } else if(day <= 0){
                    exist.push(2);
                }
            }
            clocks.push({
                id: item.id,
                name: item.name,
                owner: item.owner,
                detail: item.detail,
                beginDate: item.beginDate,
                endDate: item.endDate
            });
        }
        console.log(exist);
        res.json({
            clock: clocks,
            exist: exist
        })
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
    let startDate = new Date(day1[0], day1[1] - 1, day1[2]);
    let endDate = new Date(day2[0], day2[1] - 1, day2[2]);
    return parseInt((endDate - startDate) / 1000 / 60/ 60 / 24);
}

module.exports = router;
