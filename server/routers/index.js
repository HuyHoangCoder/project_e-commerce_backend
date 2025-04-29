const userRouter = require('./user');
const productRouter = require('./product'); 
const brandRouter = require('./brand'); 
const couponRouter = require('./coupon');
const productCategoryRouter = require('./ProductCategory'); 
const blogCategoryRouter = require('./blogCategories');  
const blogRouter = require('./blog');  
const orderRouter = require('./order');  


const { notFound, errHandler } = require('../middlewares/errHandler');

const initRouter = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);
    app.use('/api/productcategory', productCategoryRouter);
    app.use('/api/blogCategory', blogCategoryRouter);  
    app.use('/api/blog', blogRouter);  
    app.use('/api/brand', brandRouter);  
    app.use('/api/coupon', couponRouter);
    app.use('/api/order', orderRouter);

    app.use(notFound);
    app.use(errHandler);
};

module.exports = initRouter;
