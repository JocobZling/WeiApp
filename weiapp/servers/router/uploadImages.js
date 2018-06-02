let express = require('express');
let router = express.Router();
let formidable = require('formidable');
let fs = require('fs');
let path = require('path');
let User = require('../models/user');
let bodyParser = require("body-parser");
let requireAuth = require('./requireAuth');
router.use(bodyParser.json());

router.post('/upload',requireAuth, function (req, res, next) {
    let openid = req.openid;
    let moment = require('moment');
    let time = moment().format('YYYY-MM-DD');
    let dirname = __dirname.replace("\\router", '\\upload');
    if (mkdirsSync(dirname, '0777')) {
        let form = new formidable.IncomingForm();
        form.encoding = "utf-8";
        form.uploadDir = dirname;
        form.maxFontSize = 2 * 1024 * 1024;
        form.keepExtensions = true;//保留后缀
        form.parse(req, function (err, fields, files) {
            if (err) return;
            let fileName = moment().format() + '-' + files.file.name;
            let newPath = form.uploadDir + "\\" + fileName;
            fs.rename(files.file.path, newPath, function () {
                let url = newPath;
                //更新数据库
                let position = files.file.path.toString().split("\\").pop();
                User.find({openid: openid}, (err, user) => {
                    let id = user[0].images.length + 1;
                    User.update({openid: openid},
                        {
                            $push: {
                                images: {
                                    id: id,
                                    date: time,
                                    position: 'https://jocobzling.mynatapp.cc' + '/' + position
                                }
                            }
                        },
                        (err, user) => {
                            if (err) return console.error(err);
                        });
                    return res.json({
                        id: id,
                    })
                });


            });
        })
    }
});

function mkdirsSync(dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function (dirname) {
            if (dirname === "") {
                dirname = "/"
            }
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            } else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
}

module.exports = router;