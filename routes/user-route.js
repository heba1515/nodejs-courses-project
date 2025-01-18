const express = require('express');
const router = express.Router();
const multer = require('multer');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
        destination: function(req, file, cb){
                cb(null, 'uploads');
        },
        filename: function(req, file, cb){
                const ext = file.mimetype.split('/')[1];
                const filename = `user-${Date.now()}.${ext}`;
                cb(null, filename);
        }
})
const upload = multer({storage: diskStorage, fileFilter: function(req, file, cb){
        const isImage = file.mimetype.split('/')[0];
        if(isImage == 'image'){
                return cb(null, true);
        }else{
                return cb(appError.create('file must be an image', 400),false);
        }
}});

const verifyToken = require('../middleware/verifyToken');

const usersController = require('../controllers/user-controller');

router.route('/')
        .get(verifyToken, usersController.getAllUsers)

router.route('/:userId')
        .get(usersController.getOneUser)

router.route('/register')
        .post(upload.single('avatar'), usersController.register)

router.route('/login')
        .post(usersController.login)


module.exports = router;