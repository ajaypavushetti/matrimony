const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  addPhotos,
  deletePhoto,
} = require('../controllers/profileController');

// All routes are protected
router.use(auth);

// Profile CRUD routes
router.get('/', getAllProfiles);
router.get('/:id', getProfileById);
router.post('/', upload.array('photos', 4), createProfile);
router.put('/:id', upload.array('photos', 4), updateProfile);
router.delete('/:id', deleteProfile);

// Photo management routes
router.post('/:id/photos', upload.array('photos', 4), addPhotos);
router.delete('/:id/photos/:publicId', deletePhoto);

module.exports = router;
