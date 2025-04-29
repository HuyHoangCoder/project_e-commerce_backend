const router = require('express').Router();
const ctrls = require('../controllers/brand');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

// Tạo brand mới
router.post('/brands', [verifyAccessToken, isAdmin], ctrls.createBrand);

// Lấy tất cả brands
router.get('/brands', [verifyAccessToken, isAdmin], ctrls.getAllBrands);

// Lấy brand theo ID
router.get('/brands/:id', [verifyAccessToken, isAdmin], ctrls.getBrandById);

// Cập nhật brand theo ID
router.put('/brands/:id', [verifyAccessToken, isAdmin], ctrls.updateBrand);

// Xoá brand theo ID
router.delete('/brands/:id', [verifyAccessToken, isAdmin], ctrls.deleteBrand);

module.exports = router;
