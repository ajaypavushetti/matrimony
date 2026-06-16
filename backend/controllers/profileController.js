const Profile = require('../models/Profile');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// Helper: parse JSON string safely
const parseJsonSafe = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

// @desc    Create a new profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
  try {
    // Frontend sends all data as a single JSON blob under 'profileData'
    let profileData = {};
    if (req.body.profileData) {
      profileData = parseJsonSafe(req.body.profileData) || {};
    } else {
      // Fallback: use req.body directly (for JSON requests)
      profileData = req.body;
    }

    // Set creator
    profileData.createdBy = req.user._id;

    // Upload photos to Cloudinary
    profileData.photos = [];
    if (req.files && req.files.length > 0) {
      const maxPhotos = 4;
      const filesToUpload = req.files.slice(0, maxPhotos);

      for (const file of filesToUpload) {
        const result = await uploadToCloudinary(file.buffer);
        profileData.photos.push({
          url: result.url,
          publicId: result.publicId,
        });
      }
    }

    const profile = await Profile.create(profileData);

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      profile,
    });
  } catch (error) {
    console.error('CreateProfile error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating profile',
    });
  }
};

// @desc    Get all profiles with search and filters
// @route   GET /api/profiles
// @access  Private
const getAllProfiles = async (req, res) => {
  try {
    const { q, gender, marriageType, district, page = 1, limit = 50 } = req.query;

    const filter = { createdBy: req.user._id };

    // Gender filter
    if (gender) {
      filter.gender = gender;
    }

    // Marriage type filter
    if (marriageType) {
      filter.maritalStatus = marriageType;
    }

    // District filter
    if (district) {
      filter.district = {
        $regex: district,
        $options: 'i',
      };
    }

    // Search query - searches across multiple fields
    if (q) {
      const searchRegex = { $regex: q, $options: 'i' };
      filter.$or = [
        { name: searchRegex },
        { occupation: searchRegex },
        { organization: searchRegex },
        { village: searchRegex },
        { district: searchRegex },
        { education: searchRegex },
        { salary: searchRegex },
        { 'sourceMediator.name': searchRegex },
        { 'mediators.name': searchRegex },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [profiles, total] = await Promise.all([
      Profile.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Profile.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: profiles.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      profiles,
    });
  } catch (error) {
    console.error('GetAllProfiles error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profiles',
    });
  }
};

// @desc    Get single profile by ID
// @route   GET /api/profiles/:id
// @access  Private
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('GetProfileById error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Parse profileData from multipart form
    let profileData = {};
    if (req.body.profileData) {
      profileData = parseJsonSafe(req.body.profileData) || {};
    } else {
      profileData = req.body;
    }

    // List of all updateable fields (flat schema)
    const updateableFields = [
      'name', 'gender', 'dateOfBirth', 'age', 'height', 'education', 'mobile',
      'maritalStatus', 'havingKids', 'numberOfKids', 'kidsDetails',
      'fatherName', 'fatherAlive', 'fatherOccupation',
      'motherName', 'motherAlive', 'motherOccupation',
      'numberOfBrothers', 'brothers', 'numberOfSisters', 'sisters',
      'village', 'mandal', 'district', 'state', 'currentLocation', 'workingLocation',
      'occupation', 'organization', 'salary', 'salaryType',
      'assets',
      'sourceMediator', 'numberOfMediators', 'mediators',
      'commissionAmount', 'registrationFee', 'isPaid', 'amountPaid', 'paymentDate', 'paymentMode',
      'expectedAgeRange', 'expectedEducation', 'expectedJobPreference',
      'expectedLocationPreference', 'expectedSalary', 'otherRequirements',
    ];

    for (const field of updateableFields) {
      if (profileData[field] !== undefined) {
        profile[field] = profileData[field];
      }
    }

    // Handle photo deletions - removedPhotos is array of {url, publicId} objects
    if (profileData.removedPhotos) {
      const photosToRemove = Array.isArray(profileData.removedPhotos)
        ? profileData.removedPhotos
        : [];

      for (const removedPhoto of photosToRemove) {
        const publicId = removedPhoto.publicId || removedPhoto;
        try {
          await deleteFromCloudinary(publicId);
        } catch (err) {
          console.error(`Failed to delete photo ${publicId}:`, err.message);
        }
        profile.photos = profile.photos.filter(
          (photo) => photo.publicId !== publicId
        );
      }
    }

    // Handle new photo uploads
    if (req.files && req.files.length > 0) {
      const currentPhotoCount = profile.photos.length;
      const maxPhotos = 4;
      const slotsAvailable = maxPhotos - currentPhotoCount;

      if (slotsAvailable > 0) {
        const filesToUpload = req.files.slice(0, slotsAvailable);

        for (const file of filesToUpload) {
          const result = await uploadToCloudinary(file.buffer);
          profile.photos.push({
            url: result.url,
            publicId: result.publicId,
          });
        }
      }
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    console.error('UpdateProfile error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};

// @desc    Delete profile and its Cloudinary photos
// @route   DELETE /api/profiles/:id
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Delete all photos from Cloudinary
    if (profile.photos && profile.photos.length > 0) {
      for (const photo of profile.photos) {
        try {
          await deleteFromCloudinary(photo.publicId);
        } catch (err) {
          console.error(`Failed to delete photo ${photo.publicId}:`, err.message);
        }
      }
    }

    await Profile.findByIdAndDelete(profile._id);

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error('DeleteProfile error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting profile',
    });
  }
};

// @desc    Add photos to existing profile (max 4 total)
// @route   POST /api/profiles/:id/photos
// @access  Private
const addPhotos = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photos provided',
      });
    }

    const currentPhotoCount = profile.photos.length;
    const maxPhotos = 4;
    const slotsAvailable = maxPhotos - currentPhotoCount;

    if (slotsAvailable <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Maximum of 4 photos allowed. Delete existing photos to add new ones.',
      });
    }

    const filesToUpload = req.files.slice(0, slotsAvailable);
    const uploadedPhotos = [];

    for (const file of filesToUpload) {
      const result = await uploadToCloudinary(file.buffer);
      const photoData = {
        url: result.url,
        publicId: result.publicId,
      };
      profile.photos.push(photoData);
      uploadedPhotos.push(photoData);
    }

    await profile.save();

    const skippedCount = req.files.length - filesToUpload.length;

    res.status(200).json({
      success: true,
      message: `${uploadedPhotos.length} photo(s) added successfully${
        skippedCount > 0 ? `. ${skippedCount} photo(s) skipped (max 4 total).` : '.'
      }`,
      uploadedPhotos,
      totalPhotos: profile.photos.length,
    });
  } catch (error) {
    console.error('AddPhotos error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error adding photos',
    });
  }
};

// @desc    Delete a specific photo from profile and Cloudinary
// @route   DELETE /api/profiles/:id/photos/:publicId
// @access  Private
const deletePhoto = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const publicId = req.params.publicId;

    const photoIndex = profile.photos.findIndex(
      (photo) => photo.publicId === publicId || photo.publicId.endsWith(publicId)
    );

    if (photoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found in this profile',
      });
    }

    const photoPublicId = profile.photos[photoIndex].publicId;

    try {
      await deleteFromCloudinary(photoPublicId);
    } catch (err) {
      console.error(`Cloudinary delete warning: ${err.message}`);
    }

    profile.photos.splice(photoIndex, 1);
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
      totalPhotos: profile.photos.length,
    });
  } catch (error) {
    console.error('DeletePhoto error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid profile ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting photo',
    });
  }
};

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  addPhotos,
  deletePhoto,
};
