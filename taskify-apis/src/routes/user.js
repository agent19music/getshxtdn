const express = require('express');
const multer = require('multer');
const authenticate = require('../middleware/auth');
const { getProfile, updateProfile, deleteAccount, emailDigest } = require('../controllers/userController');
const { uploadAvatar } = require('../controllers/uploadController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/account', deleteAccount);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.post('/email-digest', emailDigest);

module.exports = router;
