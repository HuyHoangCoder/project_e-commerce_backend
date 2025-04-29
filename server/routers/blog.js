const router = require('express').Router();
const ctrls = require('../controllers/blog');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const uploader = require('../config/cloudinary.config')
//crud blogs
router.post('/blogs', [verifyAccessToken, isAdmin],  ctrls.createBlog);
router.put('/blogs/:id', [verifyAccessToken, isAdmin],  ctrls.updateBlog);
router.get('/blogs', [verifyAccessToken, isAdmin], ctrls.getAllBlogs);
router.get('/blogs/:id', [verifyAccessToken, isAdmin], ctrls.getBlogById);
router.delete('/blogs/:id', [verifyAccessToken], ctrls.deleteBlog);

//like dislike
router.put('/blogs/like/:id', [verifyAccessToken], ctrls.likeBlog);
router.put('/blogs/dislike/:id', [verifyAccessToken], ctrls.dislikesBlog);

//lấy bài blogs
router.get('/getInfoLike/:id', ctrls.getBlog);

//upload images
router.put('/images/:id', [verifyAccessToken, isAdmin], uploader.single('img'), ctrls.uploadImgBlog);

module.exports = router     