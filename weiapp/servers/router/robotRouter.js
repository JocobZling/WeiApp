let express = require('express');
let router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
let axios = require('axios');
let requireAuth = require('./requireAuth');
let config = require('../config');
router.use('/',requireAuth, function (req, res, next) {
    console.log(req.query.info);
    const robotApi = `http://www.tuling123.com/openapi/api`;
    axios.post(robotApi, {
        key: config.robotKey,
        userid: 1,
        info: req.query.info
    })
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
