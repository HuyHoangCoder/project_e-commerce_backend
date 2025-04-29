const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error('Missing inputs');
  }

  if (!req.body.title || req.body.title.trim() === '') {
    throw new Error('Product title is required');
  }

  req.body.slug = slugify(req.body.title);

  const newProduct = await Product.create(req.body);

  return res.status(200).json({
    success: true,
    product: newProduct,
  });
});




const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const product = await Product.findById(pid)
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : 'Cannot get product'
  })
})



const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  // Tách các trường đặc biệt ra khỏi query
  const excludeFields = ['limit', 'sort', 'page', 'fields'];
  excludeFields.forEach(el => delete queries[el]);

  // Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
  const formatedQueries = JSON.parse(queryString);

  // Filtering
  if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' };

  // Tạo query command
  let queryCommand = Product.find(formatedQueries);

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    queryCommand = queryCommand.sort(sortBy);
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  let page = +req.query.page || 1;
  let limit = +req.query.limit || 2;
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // Execute query với async/await
  try {
    const response = await queryCommand;
    const counts = await Product.countDocuments(formatedQueries);

    return res.status(200).json({
      success: response ? true : false,
      products: response ? response : 'Cannot get products',
      counts
    });
  } catch (err) {
    // Xử lý lỗi nếu có
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params

  if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
  return res.status(200).json({
    success: updatedProduct ? true : false,
    updatedProduct: updatedProduct ? updatedProduct : 'Cannot update products'
  })
})


const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params

  if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
  const deleteProduct = await Product.findByIdAndDelete(pid)
  return res.status(200).json({
    success: deleteProduct ? true : false,
    deleteProduct: deleteProduct ? deleteProduct : 'Cannot delete products'
  })
})

const ratings = asyncHandler(async (req, res) => {
  const { id } = req.user;  
  const { star, comment, pid } = req.params;

  // Kiểm tra đầu vào
  if (!star || !pid) throw new Error('Missing inputs');

  // Kiểm tra xem pid có phải ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  // Chuyển id từ chuỗi thành ObjectId hợp lệ
  const userId = mongoose.Types.ObjectId(id);  // Chuyển id thành ObjectId hợp lệ

  // Chuyển pid thành ObjectId nếu nó hợp lệ
  const productId = mongoose.Types.ObjectId(pid); // Đảm bảo pid là ObjectId

  // Tìm sản phẩm theo pid
  const ratingProduct = await Product.findById(productId);
  
  if (!ratingProduct) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Kiểm tra nếu sản phẩm đã có đánh giá của người dùng
  const alreadyRatingIndex = ratingProduct.ratings.findIndex(
    el => el.postedBy.toString() === userId.toString()  // So sánh ObjectId với userId
  );

  if (alreadyRatingIndex !== -1) {
    // Nếu đã đánh giá, cập nhật star và comment tại vị trí cụ thể trong mảng ratings
    ratingProduct.ratings[alreadyRatingIndex].star = star;
    ratingProduct.ratings[alreadyRatingIndex].comment = comment;

    await ratingProduct.save(); // Lưu sản phẩm với đánh giá đã cập nhật
    console.log('Rating updated:', ratingProduct);
  } else {
    // Nếu chưa đánh giá, thêm star và comment mới
    ratingProduct.ratings.push({ star, comment, postedBy: userId });

    await ratingProduct.save(); // Lưu sản phẩm với đánh giá mới
    console.log('Rating added:', ratingProduct);
  }

  //sum ratings
  const updatedProduct = await Product.findById(pid); // Tìm sản phẩm theo pid
  const ratingCount = updatedProduct.ratings.length; // Lấy số lượng đánh giá
  const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + el.star, 0); // Tính tổng điểm đánh giá
  updatedProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10; // Tính điểm đánh giá trung bình
  await updatedProduct.save(); // Lưu sản phẩm đã cập nhật


  return res.status(200).json({
    status: true,
    message: 'Rating successfully added or updated.',
    updatedProduct
  });
});



const uploadImgProducts = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  // Kiểm tra nếu không có file nào được tải lên
  if (!req.file) throw new Error('Missing inputs');  // Thay req.files thành req.file vì chỉ có một tệp

  const response = await Product.findByIdAndUpdate(pid, {
      $push: { images: { $each: [req.file.path] } }  // Đẩy đường dẫn của tệp vào mảng
  }, { new: true });

  return res.status(200).json({
      status: response ? true : false,
      updatedProduct: response ? response : 'Cannot upload images product'
  });
});



module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  deleteProduct,
  ratings,
  uploadImgProducts
};
