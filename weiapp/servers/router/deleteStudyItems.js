let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let User = require('../models/user');
let requireAuth = require('./requireAuth');

router.use('/', requireAuth, function (req, res, next) {
    let id = req.query.id;
    let studyResult = id.split(",");
    for (let item of studyResult) {
        User.update({"openid" : req.openid},
            {'$pull':{images: { id :item}}}, function(err, data){
                if(err) {
                    console.log(err);
                }
                console.log(data+"success");
            });

    }
});
module.exports = router;