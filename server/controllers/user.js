const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const validateRegister = require('../validation/validateRegister');
const {generateAccessToken, generateRefreshToken} = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendMail = require('../ultils/sendMail');
const register = asyncHandler(async (req, res) => {
  
    const { email, password, firstname, lastname } = req.body;
  
    
    if (!email || !password || !lastname || !firstname) {
        return res.status(400).json({ success: false, message: 'Missing inputs' });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Tạo user mới
    const newUser = await User.create(req.body);

    return res.status(201).json({
        success: true,
        user: {
            _id: newUser._id,
            email: newUser.email,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            role: newUser.role
        }
    });
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
    
  if (!email || !password) {
      return res.status(400).json({
          success: false,
          message: 'Missing inputs',
      });
  }

  const response = await User.findOne({ email });


  if (!response) {
      return res.status(401).json({
          success: false,
          message: 'Invalid credentials!',
      });
  }

  const isMatch = await response.isCorrectPassword(password);


  if (!isMatch) {
      return res.status(401).json({
          success: false,
          message: 'Invalid credentials!',
      });
  }

  const { password: _, role, ...userData } = response.toObject();
  const accessToken = generateAccessToken(response._id, role)
  const refreshToken = generateRefreshToken(response._id)
  await User.findByIdAndUpdate(response._id, {refreshToken}, {new:true})
  res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7*24*60*60*1000})
  return res.status(200).json({
      success: true,
      accessToken,
      userData,
  });
});

  

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id).select('-refreshToken -password -role')

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    return res.status(200).json({
        success: true,
        data: user,
    });
});

const refreshAccessToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if(cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')
    jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decode) => {
        if(err) throw new Error("Invalid refesh token");  
        
        const response = await User.findOne({_id: decode._id, refreshToken: cookie.refreshToken})

        return res.status(200).json(
            {success: response ? true : false, newAccessToken: response ? generateAccessToken(response._id, response.role) : "Refresh token not matched"}

            
        )

    })  

})

const logout =  asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if(!cookie || !cookie.refreshToken) throw new Error("No refesh token in cookies")
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ''}, {new: true})
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        message: 'Logout successfully'
    })
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
  
    
    const resetToken = user.createPasswordChangedToken()  
    await user.save()
  
    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`
  
    const data = {
      email,
      html
    }
  
    const rs = await sendMail(data) 
    return res.status(200).json({
      success: true,
      rs
    })
  })


const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if(!password || !token) throw new Error("Missing inputs");
    
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({passwordResetToken, passwordResetExpires: {$gt: Date.now()}})
    if(!user) throw Error("Invalid reset Token")
    user.password = password
    req.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwordResetExpires = undefined     
    await user.save()
    return res.status(200).json({
        success: user ? true: false,
        message: user ? 'Updated password' : 'Something went wrong'
    })
})



const getUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-password -role');
    return res.status(200).json({
      success: response ? true : false,
      users: response,
    });
});


const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query;
  
    if (!_id) throw new Error('Missing inputs');
  
    const response = await User.findByIdAndDelete(_id);
    return res.status(200).json({
      success: response ? true : false,
      deletedUser: response ? `User with email ${response.email} deleted` : 'No user delete'
    });
  });


  const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
  
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  
    const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select('-password -role');
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'something went wrong'
    });
  });


  const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
  
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role');
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : 'Some thing went wrong'
    });
  });


  
  const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
  
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs');
  
    const response = await User.findByIdAndUpdate(_id, {$push: { address: req.body.address }}, { new: true }).select('-password -role -resfreshToken');
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : 'Some thing went wrong'
    });
  });

  const updateCart = asyncHandler(async (req, res) => {
    const { pid, quantity, color } = req.body;
    const { _id } = req.user;
  
    if (!pid || !quantity || !color) throw new Error('Missing inputs');
  
    const user = await User.findById(_id).select('cart');
    const alreadyProduct = user.cart.find(el => el.product.toString() === pid);
  
    if (alreadyProduct) {
      if (alreadyProduct.color === color) {
        const response = await User.findOneAndUpdate(
          { _id, 'cart.product': pid, 'cart.color': color },
          { $set: { 'cart.$.quantity': quantity } },
          { new: true }
        );
  
        if (!response) {
          return res.status(400).json({ success: false, message: 'Error updating cart' });
        }
  
        return res.status(200).json({
          success: true,
          updatedUser: response,
        });
      }
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
  
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong',
      });
    }
  });
  
  
  

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart
  };