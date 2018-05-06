let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let Clock = require('../models/clock');
let requireAuth = require('./requireAuth');
router.use('/', requireAuth, function (req, res, next) {
    let exist = [];
    let clocks = [];
    Clock.find((err, clock) => {
        if (err) {
            return console.log(err);
        }
        for (let item of clock) {
            if (item.user.length === 0) {
                exist.push(2);
            }
            for (let user of item.user) {
                if (user.openid === req.openid) {
                    exist.push(1);
                } else {
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
module.exports = router;