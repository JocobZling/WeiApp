let express = require('express');
let router = express.Router();
let config = require('../config');
let axios = require('axios');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
router.use(bodyParser.json());
let User = require('../models/user');

//生成JWT认证码的函数
function generateToken(user) {
    return jwt.sign(user, config.jwtSecret, {
        expiresIn: 7200
    });
}

router.get('/onlogin', function (req, res, next) {
    let code = req.query.code;
    let thumb=req.query.thumb;
    let name=req.query.nickname;
    console.log("code" + code);
    const queryString = `appid=${config.appId}&secret=${config.appSecret}&js_code=${req.query.code}&grant_type=authorization_code`;
    const wxAPI = `https://api.weixin.qq.com/sns/jscode2session?${queryString}`;
    axios.get(wxAPI)
        .then(response => {
            console.log(response.data);
            User.findOne({openid: response.data.openid}, (err, user) => {
                if (user) {
                    console.log("找到了！");
                    return res.json({
                        token: generateToken({openid: response.data.openid})
                    })
                } else {
                    console.log("没找到！");
                    const user = new User();
                    user.openid = response.data.openid;
                    user.name=req.query.nickname;
                    user.thumb=req.query.thumb;
                    user.save();
                    return res.json({
                        token: generateToken({openid: response.data.openid})
                    })
                }
            })
        })
        .catch(error => {
            console.log(error);
        });
});


module.exports = router;