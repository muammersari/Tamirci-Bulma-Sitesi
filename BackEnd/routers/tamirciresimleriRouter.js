var express = require('express')
router = express.Router()
tamirciResimleriTBL = require('../models/tamirciresimleriModel')

var fs = require('fs');
var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + 'muammer')
    }
});

var upload = multer({ storage: storage });
router.post("/", function (req, res, next) {
    upload.single('imagee')(req, res, function (error) {
        if (error) {
            console.log(`upload.single error: ${error}`);
            return res.sendStatus(500);
        } else {
            var obj = {
                resimler: {
                    data: fs.readFileSync(path.join('./uploads/' + req.file.filename)),
                    contentType: 'image.png'
                }
            }
            tamirciResimleriTBL.create(obj, (err, item) => {
                if (err) {
                    console.log(err);
                }
                else {
                    item.save();
                    // res.redirect('/');
                }
            });
        }
        // code
    })
});
/*router.post('/', upload.single('imagee'), (req, res, next) => {
    console.log(`upload.single error: ${error}`);

    var obj = {
        resimler: {
            data: fs.readFileSync(path.join('./uploads/' + req.file.filename)),
            contentType: 'image.png'
        }
    }
    tamirciResimleriTBL.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            item.save();
           // res.redirect('/');
        }
    });
});*/
module.exports = router;