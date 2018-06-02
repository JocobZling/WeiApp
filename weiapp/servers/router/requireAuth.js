let jwt = require('jsonwebtoken');
let config = require('../config');

//JWT认证
function requireAuth(req, res, next) {
    let token = req.headers.authorization;
    //console.log(req.headers);
    if (token) {
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({error: '认证码失效，请重新登录!'});
                } else {
                    return res.status(401).json({error: '认证失败！'});
                }
            } else {
                if (decoded.openid) {
                    req.openid = decoded.openid;
                    next();
                } else {
                    res.status(401).json({error: '认证失败！'});
                }
            }
        });
    } else {
        return res.status(403).json({
            error: '请提供认证码！'
        });
    }
}

module.exports = requireAuth;