let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let Clock = require('../models/clock');
let requireAuth = require('./requireAuth');
router.use('/', function (req, res, next) {
    console.log(req.openid);
    let exist = [];
    Clock.find((err, clock) => {
        if (err) {
            return console.log(err);
        }
        console.log(clock);
        for (let i = 0; i < clock.length; i++) {
            if (clock[i].user.length > 0) {
                clock[i].user.forEach(item => {
                    if (item.openid === req.openid) {
                        exist.push(1);
                    } else {
                        exist.push(2);
                    }
                })
            } else {
                exist.push(2);
            }
        }
        console.log(exist);
        res.json({
            clock: clock,
            exist: exist
        })

    })
});
module.exports = router;