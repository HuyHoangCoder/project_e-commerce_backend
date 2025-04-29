const mongoose = require('mongoose'); // Nhập thư viện Mongoose

// Khai báo Schema của mô hình Mongo
var blogCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
}, {
  timestamps: true,
});

// Xuất mô hình
module.exports = mongoose.model('blogCategory', blogCategorySchema);