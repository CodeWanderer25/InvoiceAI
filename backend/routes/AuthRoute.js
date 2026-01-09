const express = require('express');
const { registerUser, loginUser, getMe, updateUserProfile } = require('../controllers/AuthController')
const authProtect = require('../middlewares/AuthMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/me').get(authProtect, getMe).put(authProtect, updateUserProfile);

module.exports = router;