let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let Clock = require('../models/clock');
let requireAuth =require('./requireAuth');
router.use('/', function (req, res) {
    console.log(req.query.id);
    console.log(req.openid);
    console.log(req.query.date);
    Clock.findOne({id: req.query.id}, function (err, clock) {
        if (err) return res.json({
            msg: "出错了！"
        });
        Clock.update({id: req.query.id},
            {$push: {user: {openid: req.openid, date: req.query.date}}},
            (err, msg) => {
                if (err) return res.json({
                    msg: "出错了！"
                });
            });
        console.log(clock);
        return res.json({
            clock: clock,
        })
    });


});
module.exports = router;