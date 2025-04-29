const router = require('express').Router();
const ctrls = require('../controllers/blogCategory');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/blogscategories', [verifyAccessToken, isAdmin], ctrls.createBlogCategories)

// Route để lấy tất cả các danh mục sản phẩm
router.get('/blogscategories', [verifyAccessToken, isAdmin], ctrls.getAllBlogCategories);

// Route để lấy một danh mục sản phẩm theo ID
router.get('/blogscategories/:id', [verifyAccessToken, isAdmin], ctrls.getBlogCategoriesById);

// Route để cập nhật danh mục sản phẩm theo ID
router.put('/blogscategories/:id', [verifyAccessToken, isAdmin], ctrls.updateBlogCategories);

// Route để xóa danh mục sản phẩm theo ID
router.delete('/blogscategories/:id', [verifyAccessToken, isAdmin], ctrls.deleteBlogCategories);


module.exports = router     