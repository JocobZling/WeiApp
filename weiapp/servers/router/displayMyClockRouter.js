let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let User = require('../models/user');
let requireAuth =require('./requireAuth');
router.use('/', requireAuth,function (req, res) {
    User.findOne({openid: req.openid}, (err, user) => {
        if (err) {
            return console.log(err);
        }
        return res.json({
            clocks: user.clocks
        })
    })

});
module.exports = router;