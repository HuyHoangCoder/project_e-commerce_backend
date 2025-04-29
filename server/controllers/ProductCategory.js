const ProductCategory = require('../models/productCategory'); // Nhập mô hình ProductCategory
const asyncHandler = require('express-async-handler'); // Nhập asyncHandler để xử lý lỗi

// Hàm tạo danh mục sản phẩm mới
const createCategory = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const response = await ProductCategory.create(req.body);

  return res.status(201).json({ 
    success: true,
    createdCategory: response 
  });
});


// Hàm lấy tất cả danh mục sản phẩm
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await ProductCategory.find();
    
    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'No categories found' });
    }
  
    return res.status(200).json({
      success: true,
      categories
    });
  });

  
  // Hàm lấy thông tin danh mục sản phẩm theo ID
const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params; // Lấy id từ params trong URL
  
    // Kiểm tra xem danh mục có tồn tại không
    const category = await ProductCategory.findById(id);
  
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  
    return res.status(200).json({
      success: true,
      category
    });
  });
  

  // Hàm cập nhật danh mục sản phẩm
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
  
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
  
    // Tìm và cập nhật danh mục
    const category = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });
  
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  
    return res.status(200).json({
      success: true,
      updatedCategory: category
    });
  });

  
  // Hàm xóa danh mục sản phẩm
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Tìm và xóa danh mục
    const category = await ProductCategory.findByIdAndDelete(id);
  
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  
    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  });

  
  module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
  };
  