let express = require('express');
let router = express.Router();
let formidable = require('formidable');
let fs = require('fs');
let path = require('path');
let requireAuth =require('./requireAuth');

let bodyParser = require("body-parser");
router.use(bodyParser.json());
router.post('/upload',requireAuth,function (req, res, next) {
    let openid=req.openid;
    let moment = require('moment');
    let time = moment().format('YYYY-MM-DD');
    let dirname = __dirname.replace("\\router", '\\upload');
    //console.log(dirname);
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
                let position=files.file.path.toString().split("\\").pop();
                //drawPicture('../../upload/'+position);
                console.log('https://www.jocobzling.club'+position);
                res.json({
                    position:position,
                })
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