let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let User = require('../models/user');
let Clock = require('../models/clock');
let requireAuth = require('./requireAuth');
router.use('/',requireAuth,function (req, res) {
    let clockDetail = [];
    User.findOne({openid: req.openid}, (err, user) => {
        if (err) {
            return console.log(err);
        }
        for (let item of user.clocks) {
            Clock.find({id: item.id}, (err, clock) => {
                if (err) {
                    return console.log(err);
                }
                clockDetail.push({
                    id:clock[0].id,
                    name: clock[0].name,
                    image: clock[0].image,
                    detail: clock[0].detail
                });
                if (clockDetail.length === user.clocks.length) {
                    return res.json({
                        clocks: clockDetail,
                    })
                }
            });
        }

    });


});
module.exports = router;