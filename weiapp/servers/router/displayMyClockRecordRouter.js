let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let requireAuth = require('./requireAuth');
let User = require('../models/user');

router.use('/', requireAuth, function (req, res) {
    let result=[];
    User.findOne({openid: req.openid}, (err, user) => {
        if (err) {
            return console.log(err);
        }
        for(let item of user.clocks){
            if(item.id.toString()===req.query.id.toString()){
                result.push(item);//0
            }
        }
        result.push(user.name);//1
        result.push(user.thumb);//2
        return res.json({
            user: result
        })
    });
});
module.exports = router;