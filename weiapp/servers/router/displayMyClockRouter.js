let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let User = require('../models/user');
let Clock = require('../models/clock');
let requireAuth = require('./requireAuth');
router.use('/',requireAuth,function (req, res) {
    let clockDetail = [];
    console.log(req.openid);
    User.find({openid: req.openid}, (err, user) => {
        if (err) {
            return console.log(err);
        }
        for (let item of user[0].clocks) {
           let ids =parseInt(item.id);
           Clock.find({id:ids}, (err, clock) => {
                if (err) {
                    return console.log(err);
                }
                console.log("-------------------------");
                console.log(clock);
                clockDetail.push({
                    id:clock[0].id,
                    name: clock[0].name,
                    image: clock[0].image,
                    detail: clock[0].detail
                });
                if (clockDetail.length === user[0].clocks.length) {
                    return res.json({
                        clocks: clockDetail,
                    })
                }
            });
        }

    });


});
module.exports = router;
