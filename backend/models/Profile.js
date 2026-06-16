const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    // Personal Details
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Bride', 'Groom'],
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
    },
    height: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    maritalStatus: {
      type: String,
      enum: ['First Marriage', 'Second Marriage'],
      default: 'First Marriage',
    },
    havingKids: {
      type: String,
      enum: ['Yes', 'No', 'NA'],
      default: 'NA',
    },
    numberOfKids: {
      type: Number,
      default: 0,
    },
    kidsDetails: {
      type: String,
      default: '',
    },

    // Family Details
    fatherName: {
      type: String,
      default: '',
    },
    fatherAlive: {
      type: String,
      enum: ['Alive', 'Not Alive', 'NA'],
      default: 'Alive',
    },
    fatherOccupation: {
      type: String,
      default: '',
    },
    motherName: {
      type: String,
      default: '',
    },
    motherAlive: {
      type: String,
      enum: ['Alive', 'Not Alive', 'NA'],
      default: 'Alive',
    },
    motherOccupation: {
      type: String,
      default: '',
    },
    numberOfBrothers: {
      type: Number,
      default: 0,
    },
    brothers: [
      {
        status: {
          type: String,
          enum: ['Married', 'Unmarried'],
          default: 'Unmarried',
        },
      },
    ],
    numberOfSisters: {
      type: Number,
      default: 0,
    },
    sisters: [
      {
        status: {
          type: String,
          enum: ['Married', 'Unmarried'],
          default: 'Unmarried',
        },
      },
    ],

    // Location Details
    village: {
      type: String,
      default: '',
    },
    mandal: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    currentLocation: {
      type: String,
      default: '',
    },
    workingLocation: {
      type: String,
      default: '',
    },

    // Job Details
    occupation: {
      type: String,
      default: '',
    },
    organization: {
      type: String,
      default: '',
    },
    salary: {
      type: String,
      default: '',
    },
    salaryType: {
      type: String,
      enum: ['Monthly', 'Yearly', 'NA'],
      default: 'Monthly',
    },

    // Assets
    assets: {
      type: String,
      default: '',
    },

    // Photos (stored as Cloudinary references)
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    // Mediator Details
    sourceMediator: {
      name: { type: String, default: '' },
      mobile: { type: String, default: '' },
      location: { type: String, default: '' },
    },
    numberOfMediators: {
      type: Number,
      default: 0,
    },
    mediators: [
      {
        name: { type: String, default: '' },
        mobile: { type: String, default: '' },
      },
    ],

    // Payment Details
    commissionAmount: {
      type: Number,
      default: 0,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: String,
      default: '',
    },
    paymentMode: {
      type: String,
      default: '',
    },

    // Expected Partner Details
    expectedAgeRange: {
      type: String,
      default: '',
    },
    expectedEducation: {
      type: String,
      default: '',
    },
    expectedJobPreference: {
      type: String,
      default: '',
    },
    expectedLocationPreference: {
      type: String,
      default: '',
    },
    expectedSalary: {
      type: String,
      default: '',
    },
    otherRequirements: {
      type: String,
      default: '',
    },

    // Meta
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search performance
profileSchema.index({ name: 'text' });
profileSchema.index({ createdBy: 1 });
profileSchema.index({ gender: 1 });
profileSchema.index({ maritalStatus: 1 });

module.exports = mongoose.model('Profile', profileSchema);
