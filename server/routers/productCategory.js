const router = require('express').Router();
const ctrls = require('../controllers/productCategory');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/categories', [verifyAccessToken, isAdmin], ctrls.createCategory)

// Route để lấy tất cả các danh mục sản phẩm
router.get('/categories', [verifyAccessToken, isAdmin], ctrls.getAllCategories);

// Route để lấy một danh mục sản phẩm theo ID
router.get('/categories/:id', [verifyAccessToken, isAdmin], ctrls.getCategoryById);

// Route để cập nhật danh mục sản phẩm theo ID
router.put('/categories/:id', [verifyAccessToken, isAdmin], ctrls.updateCategory);

// Route để xóa danh mục sản phẩm theo ID
router.delete('/categories/:id', [verifyAccessToken, isAdmin], ctrls.deleteCategory);


module.exports = router     