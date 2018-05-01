let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let Clock = require('../models/clock');
let User = require('../models/user');
let requireAuth =require('./requireAuth');

router.use('/', requireAuth, function (req, res, next) {
    let clockResult = [];
    let studyResult = [];
    Clock.find((err, clock) => {
            if (err) return err;
            clock.forEach(item => {
                item.user.forEach(item2 => {
                    if (item2.openid === req.openid) {
                        clockResult.push(item);
                    }
                })
            });
            User.findOne({openid: req.openid}, (err, user) => {
                if (err) {
                    return console.log(err);
                }
                return res.json({
                    clock: clockResult,
                    study: user
                })
            });

        }
    );


});
module.exports = router;