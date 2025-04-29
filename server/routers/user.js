const router = require('express').Router();
const ctrls = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');
const { validateRegister, validateLogin } = require('../validation/validateRegister');
//management user
router.post('/register', validateRegister, ctrls.register);
router.post('/login', validateLogin, ctrls.login);
router.get('/current',verifyAccessToken,  ctrls.getCurrent);
router.post('/refreshtoken',  ctrls.refreshAccessToken);
router.post('/logout', ctrls.logout);
router.post('/forgotpassword', ctrls.forgotPassword);
router.put('/resetpassword', ctrls.resetPassword);
router.get('/getalluser', [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete('/deleteuser', [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put('/updateUser', [verifyAccessToken], ctrls.updateUser);
router.put('/updateUserByAdmin/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);
router.put('/address/:uid', [verifyAccessToken], ctrls.updateUserAddress);
router.put('/cart', [verifyAccessToken, isAdmin], ctrls.updateCart);


module.exports = router 