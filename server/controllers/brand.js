const Brand = require('../models/brand'); // Nhập mô hình Brand
const asyncHandler = require('express-async-handler'); // Xử lý lỗi bất đồng bộ
const mongoose = require('mongoose');

// Tạo brand mới
const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) throw new Error('Missing brand title');

  const response = await Brand.create(req.body);

  return res.json({
    success: response ? true : false,
    createdBrand: response ? response : 'Cannot create new brand'
  });
});

// Lấy tất cả brands
const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  if (brands.length === 0) {
    return res.status(404).json({ success: false, message: 'No brands found' });
  }

  return res.status(200).json({
    success: true,
    brands
  });
});

// Lấy brand theo ID
const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid brand ID' });
  }

  const brand = await Brand.findById(id);

  if (!brand) {
    return res.status(404).json({ success: false, message: 'Brand not found' });
  }

  return res.status(200).json({
    success: true,
    brand
  });
});

// Cập nhật brand
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid brand ID' });
  }

  if (Object.keys(req.body).length === 0) {
    throw new Error('Missing update data');
  }

  const response = await Brand.findByIdAndUpdate(id, req.body, { new: true });

  return res.json({
    success: response ? true : false,
    updatedBrand: response ? response : 'Cannot update brand'
  });
});

// Xóa brand
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid brand ID' });
  }

  const deletedBrand = await Brand.findByIdAndDelete(id);

  if (!deletedBrand) {
    return res.status(404).json({ success: false, message: 'Brand not found' });
  }

  return res.status(200).json({
    success: true,
    message: 'Brand deleted successfully'
  });
});

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand
};
