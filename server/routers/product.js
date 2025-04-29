const router = require('express').Router();
const ctrls = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require('../config/cloudinary.config')

// management products
router.post('/addProducts', [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get('/',  ctrls.getProducts);
router.get('/getProducts/:pid',  ctrls.getProduct);
router.put('/:pid',  [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete('/:pid',  [verifyAccessToken, isAdmin], ctrls.deleteProduct);
// management ratings
router.put('/ratings', [verifyAccessToken], ctrls.ratings);
// management upload 
router.put('/uploadImg/:pid', [verifyAccessToken, isAdmin], uploader.single('img'), ctrls.uploadImgProducts);
module.exports = router     
