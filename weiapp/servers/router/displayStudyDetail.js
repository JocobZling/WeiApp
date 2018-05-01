let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let User = require('../models/user');
let requireAuth =require('./requireAuth');

router.use('/',requireAuth,function (req, res, next) {
    User.findOne({openid: req.openid}, (err, user) => {
        if (err) {
            return console.log(err);
        }
        let images = user.images.filter(item => {
            return item.id.toString() === req.query.id.toString();
        });
        res.json({
            images: images
        })

    })
});
module.exports = router;