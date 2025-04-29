const router = require('express').Router();
const ctrls = require('../controllers/coupon');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

// Tạo brand mới
router.post('/coupon', [verifyAccessToken, isAdmin], ctrls.createNewCoupon);

// Lấy tất cả brands
router.get('/coupon', ctrls.getCoupons);

// Lấy brand theo ID
router.get('/coupon/:id', [verifyAccessToken, isAdmin], ctrls.getCouponById);

// Cập nhật brand theo ID
router.put('/coupon/:id', [verifyAccessToken, isAdmin], ctrls.updateCoupon);

// Xoá brand theo ID
router.delete('/coupon/:id', [verifyAccessToken, isAdmin], ctrls.deleteCoupon);

module.exports = router;
