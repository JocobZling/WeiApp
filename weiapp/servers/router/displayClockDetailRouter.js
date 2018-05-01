let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let requireAuth =require('./requireAuth');
router.use('/',requireAuth,function (req, res, next) {
    console.log(req.query.id);
    Clock.findOne({id: req.query.id}, (err, clock) => {
        if (err) {
            return console.log(err);
        }
        console.log(clock);
        res.json({
            clock: clock,
        })

    })
});
module.exports = router;