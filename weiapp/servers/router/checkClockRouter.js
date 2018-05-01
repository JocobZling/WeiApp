let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let Clock = require('../models/clock');
let requireAuth =require('./requireAuth');
router.use('/', requireAuth, function (req, res) {
    console.log(req.query.id);
    console.log(req.openid);
    console.log(req.query.date);
    let clocks = [];
    Clock.findOne({id: req.query.id}, function (err, clock) {
        if (err) return res.json({
            msg: "出错了！"
        });
        let dateOld = clock.user[0].date;
        console.log(dateOld);
        Clock.update({user: {openid: req.openid, date: clock.user[0].date}}, {
                $set: {
                    user: {
                        openid: req.openid,
                        date: clock.user[0].date+","+[req.query.date],
                    }
                }
            },
            (err, msg) => {
                if (err) return res.json({
                    msg: "出错了！"
                });
                console.log(msg);
                return res.json({
                    clock: clock
                })
            });
    });
});
module.exports = router;