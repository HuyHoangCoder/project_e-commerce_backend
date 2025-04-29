const Blog = require('../models/blog'); // Nhập mô hình Blog
const asyncHandler = require('express-async-handler'); // Xử lý lỗi bất đồng bộ
const mongoose = require('mongoose');

// Tạo blog mới
const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;

    if (!title || !description || !category) throw new Error('Missing inputs');
    
    const response = await Blog.create(req.body);
    
    return res.json({
      success: response ? true : false,
      createdBlog: response ? response : 'Cannot create new blog'
    });
});

// Lấy tất cả blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();

  if (blogs.length === 0) {
    return res.status(404).json({ success: false, message: 'No blogs found' });
  }

  return res.status(200).json({
    success: true,
    blogs
  });
});

// Lấy thông tin blog theo ID
const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  return res.status(200).json({
    success: true,
    blog
  });
});

// Cập nhật blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    const response = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    return res.json({
      success: response ? true : false,
      updateBlog: response ? response : 'Cannot update blog'
    });
  });


// Xóa blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedBlog = await Blog.findByIdAndDelete(id);

  if (!deletedBlog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  return res.status(200).json({
    success: true,
    message: 'Blog deleted successfully'
  });
});


// Hàm likeBlog xử lý việc thích hoặc bỏ thích một bài viết
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;  // Lấy _id của user từ token
  const { id } = req.params;   // Lấy blog ID từ body của request
  console.log("ID:", id);
  console.log("User ID:", _id);
  
  if (!id) {
    return res.status(400).json({ message: 'Blog ID is required' });
  }

  // Kiểm tra xem id có phải là một ObjectId hợp lệ của MongoDB không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Blog ID' });
  }

  // Tìm blog theo id
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  // Kiểm tra nếu người dùng đã dislike bài viết này
  const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(id, { $pull: { dislikes: _id } }, { new: true });
    return res.json({
      success: response ? true : false,
      rs: response
    });
  }

  // Kiểm tra nếu người dùng đã like bài viết này
  const isLiked = blog?.likes?.find(el => el.toString() === _id);
  if (isLiked) {
    // Nếu người dùng đã like, thì bỏ like
    const response = await Blog.findByIdAndUpdate(id, { $pull: { likes: _id } }, { new: true });
    return res.json({
      success: response ? true : false,
      rs: response
    });
  } else {
    // Nếu chưa like, thêm like vào bài viết
    const response = await Blog.findByIdAndUpdate(id, { $push: { likes: _id } }, { new: true });
    return res.json({
      success: response ? true : false,
      rs: response
    });
  }
});


const dislikesBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;  // user ID từ token
  const { id } = req.params; // blog ID từ params

  if (!id) {
    return res.status(400).json({ message: 'Blog ID is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Blog ID' });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const isDisliked = blog.dislikes.includes(_id);
  const isLiked = blog.likes.includes(_id);

  let updatedBlog;

  if (isDisliked) {
    // Nếu đã dislike → gỡ dislike
    updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $pull: { dislikes: _id } },
      { new: true }
    );
  } else {
    // Nếu đang like → gỡ like
    if (isLiked) {
      await Blog.findByIdAndUpdate(
        id,
        { $pull: { likes: _id } },
        { new: true }
      );
    }
    // Thêm dislike
    updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $push: { dislikes: _id } },
      { new: true }
    );
  }

  return res.json({
    success: !!updatedBlog,
    rs: updatedBlog
  });
});


const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndUpdate(id, { $inc: { numberViews: 1 } }, { new: true })
    .populate('likes', 'firstname lastname')
    .populate('dislikes', 'firstname lastname');
  return res.json({
    success: blog ? true : false,
    rs: blog
  });
});



const uploadImgBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Kiểm tra nếu không có file nào được tải lên
  if (!req.file) throw new Error('Missing inputs');  // Thay req.files thành req.file vì chỉ có một tệp

  const response = await Blog.findByIdAndUpdate(id, {
      $push: { images: { $each: [req.file.path] } }  // Đẩy đường dẫn của tệp vào mảng
  }, { new: true });

  return res.status(200).json({
      status: response ? true : false,
      uploadImgBlog: response ? response : 'Cannot upload images blogs'
  });
});


module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikesBlog,
  getBlog,
  uploadImgBlog
};
