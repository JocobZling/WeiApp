let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let Clock = require('../models/clock');
let requireAuth = require('./requireAuth');
let User = require('../models/user');
router.use('/', requireAuth, function (req, res) {
    console.log("bulbul" + req.query.id);
    let date = getNowFormatDate();//当前日期
    Clock.findOne({id: req.query.id}, function (err, clock) {
        if (err) return res.json({
            msg: "出错了！"
        });
        Clock.update({id: req.query.id},
            {$push: {user: {openid: req.openid,joinDate: date}}},
            (err, msg) => {
                if (err) return res.json({
                    msg: "出错了！"
                });
            });
        User.update({openid: req.openid},
            {
                $push: {
                    clocks: {
                        id: req.query.id,
                        joinDate: date,
                        signInDate: []
                    }
                }
            }, (err, msg) => {
                if (err) return res.json({
                    msg: "出错了！"
                });
            });
        return res.json({
            clock: clock,
        })
    });
});

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

module.exports = router;
