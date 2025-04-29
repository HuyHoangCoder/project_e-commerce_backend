const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

//create coupon 
const createNewCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error('Missing inputs');
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + expiry * 24 * 60 * 60 * 1000
  });
  return res.json({
    success: response ? true : false,
    createdCoupon: response ? response : 'Cannot create new coupon'
  });
});

//select coupon
const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select('-createdAt -updatedAt');
  return res.json({
    success: response ? true : false,
    coupons: response ? response : 'Cannot get coupons'
  });
});

// Lấy coupon theo ID
const getCouponById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid coupon ID' });
  }

  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  res.status(200).json({
    success: true,
    coupon
  });
});

// Cập nhật coupon
const updateCoupon = asyncHandler(async (req, res) => { 
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid coupon ID' });
  }

  const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

  if (!updatedCoupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found or not updated' });
  }

  res.json({
    success: true,
    updatedCoupon
  });
});

// Xóa coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid coupon ID' });
  }

  const deletedCoupon = await Coupon.findByIdAndDelete(id);

  if (!deletedCoupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Coupon deleted successfully'
  });
});

module.exports = {
  createNewCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon
};
