let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let Clock = require('../models/clock');
let User = require('../models/user');
let requireAuth = require('./requireAuth');
router.use('/', requireAuth, function (req, res) {
    console.log(req.query.info);
    let date = getNowFormatDate();//当前日期
    User.update({openid: req.openid, clocks: {$elemMatch: {id: req.query.id}}},
        {
            $addToSet: {
                "clocks.$.signInDate": {
                    date: date,
                    info: req.query.info
                }
            }
        },
        (err, user) => {
            if (err) {
                return console.log(err);
            }
            return res.json({
                flag: "更新成功！"
            })
        })
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