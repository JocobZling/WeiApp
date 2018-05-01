let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let axios = require('axios');
let requireAuth = require('./requireAuth');
let config = require('../config');

router.use('/',requireAuth, function (req, res, next) {
    console.log(req.query.sign);
    let sign = encodeURI(req.query.sign);//转成URL编码即可使用
    console.log(sign);
    const queryString = `consName=${sign}&type=today&key=${config.signKey}`;
    const signApi = `http://web.juhe.cn:8080/constellation/getAll?${queryString}`;
    axios.get(signApi)
        .then(response => {
            return res.json({
                info: response.data
            })
        })
        .catch(error => {
            console.log(error);
        });
});
module.exports = router;