import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronDown, FiArrowLeft, FiCamera, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import API from '../api/axios';
import { useToast } from '../components/Toast';

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState([]);
  const [openSections, setOpenSections] = useState({
    personal: true,
    family: false,
    location: false,
    job: false,
    assets: false,
    photos: false,
    mediator: false,
    payment: false,
    expected: false,
  });

  const [formData, setFormData] = useState({
    name: '', gender: '', dateOfBirth: '', age: '',
    height: '', heightNA: false,
    education: '', educationNA: false,
    mobile: '', mobileNA: false,
    maritalStatus: 'First Marriage',
    havingKids: 'No', numberOfKids: '', kidsDetails: '',

    fatherName: '', fatherNameNA: false,
    fatherAlive: 'Alive',
    fatherOccupation: '', fatherOccupationNA: false,
    motherName: '', motherNameNA: false,
    motherAlive: 'Alive',
    motherOccupation: '', motherOccupationNA: false,
    numberOfBrothers: 0, brothers: [],
    numberOfSisters: 0, sisters: [],

    village: '', villageNA: false,
    mandal: '', mandalNA: false,
    district: '', districtNA: false,
    state: '', stateNA: false,
    currentLocation: '', currentLocationNA: false,
    workingLocation: '', workingLocationNA: false,

    occupation: '', occupationNA: false,
    organization: '', organizationNA: false,
    salary: '', salaryNA: false,
    salaryType: 'Monthly',

    assets: '', assetsNA: false,

    sourceMediatorName: '', sourceMediatorMobile: '', sourceMediatorLocation: '',
    numberOfMediators: 0, mediators: [],

    commissionAmount: '', registrationFee: '',
    isPaid: 'No', amountPaid: '', paymentDate: '', paymentMode: '',

    expectedAgeRange: '',
    expectedEducation: '', expectedEducationNA: false,
    expectedJobPreference: '', expectedJobPreferenceNA: false,
    expectedLocationPreference: '', expectedLocationPreferenceNA: false,
    expectedSalary: '', expectedSalaryNA: false,
    otherRequirements: '', otherRequirementsNA: false,
  });

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const isNA = (val) => val === 'NA';

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/api/profiles/${id}`);
      const p = res.data.profile;

      setFormData({
        name: p.name || '',
        gender: p.gender || '',
        dateOfBirth: p.dateOfBirth ? p.dateOfBirth.substring(0, 10) : '',
        age: p.age || '',
        height: isNA(p.height) ? 'NA' : (p.height || ''),
        heightNA: isNA(p.height),
        education: isNA(p.education) ? 'NA' : (p.education || ''),
        educationNA: isNA(p.education),
        mobile: isNA(p.mobile) ? 'NA' : (p.mobile || ''),
        mobileNA: isNA(p.mobile),
        maritalStatus: p.maritalStatus || 'First Marriage',
        havingKids: p.havingKids || 'No',
        numberOfKids: p.numberOfKids || '',
        kidsDetails: p.kidsDetails || '',

        fatherName: isNA(p.fatherName) ? 'NA' : (p.fatherName || ''),
        fatherNameNA: isNA(p.fatherName),
        fatherAlive: p.fatherAlive || 'Alive',
        fatherOccupation: isNA(p.fatherOccupation) ? 'NA' : (p.fatherOccupation || ''),
        fatherOccupationNA: isNA(p.fatherOccupation),
        motherName: isNA(p.motherName) ? 'NA' : (p.motherName || ''),
        motherNameNA: isNA(p.motherName),
        motherAlive: p.motherAlive || 'Alive',
        motherOccupation: isNA(p.motherOccupation) ? 'NA' : (p.motherOccupation || ''),
        motherOccupationNA: isNA(p.motherOccupation),
        numberOfBrothers: p.numberOfBrothers || 0,
        brothers: p.brothers || [],
        numberOfSisters: p.numberOfSisters || 0,
        sisters: p.sisters || [],

        village: isNA(p.village) ? 'NA' : (p.village || ''),
        villageNA: isNA(p.village),
        mandal: isNA(p.mandal) ? 'NA' : (p.mandal || ''),
        mandalNA: isNA(p.mandal),
        district: isNA(p.district) ? 'NA' : (p.district || ''),
        districtNA: isNA(p.district),
        state: isNA(p.state) ? 'NA' : (p.state || ''),
        stateNA: isNA(p.state),
        currentLocation: isNA(p.currentLocation) ? 'NA' : (p.currentLocation || ''),
        currentLocationNA: isNA(p.currentLocation),
        workingLocation: isNA(p.workingLocation) ? 'NA' : (p.workingLocation || ''),
        workingLocationNA: isNA(p.workingLocation),

        occupation: isNA(p.occupation) ? 'NA' : (p.occupation || ''),
        occupationNA: isNA(p.occupation),
        organization: isNA(p.organization) ? 'NA' : (p.organization || ''),
        organizationNA: isNA(p.organization),
        salary: isNA(p.salary) ? 'NA' : (p.salary || ''),
        salaryNA: isNA(p.salary),
        salaryType: p.salaryType || 'Monthly',

        assets: isNA(p.assets) ? 'NA' : (p.assets || ''),
        assetsNA: isNA(p.assets),

        sourceMediatorName: p.sourceMediator?.name || '',
        sourceMediatorMobile: p.sourceMediator?.mobile || '',
        sourceMediatorLocation: p.sourceMediator?.location || '',
        numberOfMediators: p.numberOfMediators || 0,
        mediators: p.mediators || [],

        commissionAmount: p.commissionAmount || '',
        registrationFee: p.registrationFee || '',
        isPaid: p.isPaid ? 'Yes' : 'No',
        amountPaid: p.amountPaid || '',
        paymentDate: p.paymentDate ? p.paymentDate.substring(0, 10) : '',
        paymentMode: p.paymentMode || '',

        expectedAgeRange: p.expectedAgeRange || '',
        expectedEducation: isNA(p.expectedEducation) ? 'NA' : (p.expectedEducation || ''),
        expectedEducationNA: isNA(p.expectedEducation),
        expectedJobPreference: isNA(p.expectedJobPreference) ? 'NA' : (p.expectedJobPreference || ''),
        expectedJobPreferenceNA: isNA(p.expectedJobPreference),
        expectedLocationPreference: isNA(p.expectedLocationPreference) ? 'NA' : (p.expectedLocationPreference || ''),
        expectedLocationPreferenceNA: isNA(p.expectedLocationPreference),
        expectedSalary: isNA(p.expectedSalary) ? 'NA' : (p.expectedSalary || ''),
        expectedSalaryNA: isNA(p.expectedSalary),
        otherRequirements: isNA(p.otherRequirements) ? 'NA' : (p.otherRequirements || ''),
        otherRequirementsNA: isNA(p.otherRequirements),
      });

      setExistingPhotos(p.photos || []);
    } catch (err) {
      showError('Failed to load profile');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNAToggle = (fieldName) => {
    const naKey = `${fieldName}NA`;
    setFormData((prev) => ({
      ...prev,
      [naKey]: !prev[naKey],
      [fieldName]: !prev[naKey] ? 'NA' : '',
    }));
  };

  const handleBrothersChange = (count) => {
    const num = Math.max(0, Math.min(10, parseInt(count) || 0));
    const brothers = Array.from({ length: num }, (_, i) =>
      formData.brothers[i] || { status: 'Unmarried' }
    );
    setFormData((prev) => ({ ...prev, numberOfBrothers: num, brothers }));
  };

  const handleSistersChange = (count) => {
    const num = Math.max(0, Math.min(10, parseInt(count) || 0));
    const sisters = Array.from({ length: num }, (_, i) =>
      formData.sisters[i] || { status: 'Unmarried' }
    );
    setFormData((prev) => ({ ...prev, numberOfSisters: num, sisters }));
  };

  const handleSiblingStatusChange = (type, index, status) => {
    setFormData((prev) => {
      const arr = [...prev[type]];
      arr[index] = { ...arr[index], status };
      return { ...prev, [type]: arr };
    });
  };

  const handleMediatorsChange = (count) => {
    const num = Math.max(0, Math.min(10, parseInt(count) || 0));
    const mediators = Array.from({ length: num }, (_, i) =>
      formData.mediators[i] || { name: '', mobile: '' }
    );
    setFormData((prev) => ({ ...prev, numberOfMediators: num, mediators }));
  };

  const handleMediatorFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const mediators = [...prev.mediators];
      mediators[index] = { ...mediators[index], [field]: value };
      return { ...prev, mediators };
    });
  };

  const removeExistingPhoto = (index) => {
    const photo = existingPhotos[index];
    setRemovedPhotos((prev) => [...prev, photo]);
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalPhotos = existingPhotos.length + newPhotoPreviews.length;
    const remaining = 4 - totalPhotos;
    const toAdd = files.slice(0, remaining);

    const previews = toAdd.map((file) => URL.createObjectURL(file));
    setNewPhotoPreviews((prev) => [...prev, ...previews]);
    setNewPhotoFiles((prev) => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const removeNewPhoto = (index) => {
    URL.revokeObjectURL(newPhotoPreviews[index]);
    setNewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    setNewPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Name is required');
      return;
    }
    if (!formData.gender) {
      showError('Gender is required');
      return;
    }
    if (!formData.age) {
      showError('Age is required');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();

      const profileData = {
        name: formData.name,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        age: parseInt(formData.age),
        height: formData.heightNA ? 'NA' : formData.height,
        education: formData.educationNA ? 'NA' : formData.education,
        mobile: formData.mobileNA ? 'NA' : formData.mobile,
        maritalStatus: formData.maritalStatus,
        havingKids: formData.maritalStatus === 'Second Marriage' ? formData.havingKids : 'No',
        numberOfKids: formData.maritalStatus === 'Second Marriage' && formData.havingKids === 'Yes'
          ? parseInt(formData.numberOfKids) || 0 : 0,
        kidsDetails: formData.maritalStatus === 'Second Marriage' && formData.havingKids === 'Yes'
          ? formData.kidsDetails : '',

        fatherName: formData.fatherNameNA ? 'NA' : formData.fatherName,
        fatherAlive: formData.fatherAlive,
        fatherOccupation: formData.fatherOccupationNA ? 'NA' : formData.fatherOccupation,
        motherName: formData.motherNameNA ? 'NA' : formData.motherName,
        motherAlive: formData.motherAlive,
        motherOccupation: formData.motherOccupationNA ? 'NA' : formData.motherOccupation,
        numberOfBrothers: formData.numberOfBrothers,
        brothers: formData.brothers,
        numberOfSisters: formData.numberOfSisters,
        sisters: formData.sisters,

        village: formData.villageNA ? 'NA' : formData.village,
        mandal: formData.mandalNA ? 'NA' : formData.mandal,
        district: formData.districtNA ? 'NA' : formData.district,
        state: formData.stateNA ? 'NA' : formData.state,
        currentLocation: formData.currentLocationNA ? 'NA' : formData.currentLocation,
        workingLocation: formData.workingLocationNA ? 'NA' : formData.workingLocation,

        occupation: formData.occupationNA ? 'NA' : formData.occupation,
        organization: formData.organizationNA ? 'NA' : formData.organization,
        salary: formData.salaryNA ? 'NA' : formData.salary,
        salaryType: formData.salaryType,

        assets: formData.assetsNA ? 'NA' : formData.assets,

        sourceMediator: {
          name: formData.sourceMediatorName,
          mobile: formData.sourceMediatorMobile,
          location: formData.sourceMediatorLocation,
        },
        numberOfMediators: formData.numberOfMediators,
        mediators: formData.mediators,

        commissionAmount: parseFloat(formData.commissionAmount) || 0,
        registrationFee: parseFloat(formData.registrationFee) || 0,
        isPaid: formData.isPaid === 'Yes',
        amountPaid: formData.isPaid === 'Yes' ? parseFloat(formData.amountPaid) || 0 : 0,
        paymentDate: formData.isPaid === 'Yes' ? formData.paymentDate : '',
        paymentMode: formData.isPaid === 'Yes' ? formData.paymentMode : '',

        expectedAgeRange: formData.expectedAgeRange,
        expectedEducation: formData.expectedEducationNA ? 'NA' : formData.expectedEducation,
        expectedJobPreference: formData.expectedJobPreferenceNA ? 'NA' : formData.expectedJobPreference,
        expectedLocationPreference: formData.expectedLocationPreferenceNA ? 'NA' : formData.expectedLocationPreference,
        expectedSalary: formData.expectedSalaryNA ? 'NA' : formData.expectedSalary,
        otherRequirements: formData.otherRequirementsNA ? 'NA' : formData.otherRequirements,

        existingPhotos: existingPhotos,
        removedPhotos: removedPhotos,
      };

      submitData.append('profileData', JSON.stringify(profileData));

      newPhotoFiles.forEach((file) => {
        submitData.append('photos', file);
      });

      await API.put(`/api/profiles/${id}`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showSuccess('Profile updated successfully!');
      navigate(`/profile/${id}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingAmount = Math.max(0,
    (parseFloat(formData.registrationFee) || 0) - (parseFloat(formData.amountPaid) || 0)
  );

  const totalPhotos = existingPhotos.length + newPhotoPreviews.length;

  const renderNAInput = (fieldName, label, type = 'text', extra = {}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="input-with-na">
        <input
          type={type}
          name={fieldName}
          className="form-input"
          value={formData[fieldName]}
          onChange={handleChange}
          disabled={formData[`${fieldName}NA`]}
          {...extra}
        />
        <label className="na-toggle">
          <input
            type="checkbox"
            checked={formData[`${fieldName}NA`] || false}
            onChange={() => handleNAToggle(fieldName)}
          />
          NA
        </label>
      </div>
    </div>
  );

  const renderNATextarea = (fieldName, label, placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="input-with-na">
        <textarea
          name={fieldName}
          className="form-textarea"
          value={formData[fieldName]}
          onChange={handleChange}
          disabled={formData[`${fieldName}NA`]}
          placeholder={placeholder}
        />
        <label className="na-toggle">
          <input
            type="checkbox"
            checked={formData[`${fieldName}NA`] || false}
            onChange={() => handleNAToggle(fieldName)}
          />
          NA
        </label>
      </div>
    </div>
  );

  const renderSection = (key, title, emoji, content) => (
    <div className="card mb-3" key={key}>
      <div className="section-header" onClick={() => toggleSection(key)}>
        <h3>{emoji} {title}</h3>
        <FiChevronDown className={`chevron ${openSections[key] ? 'open' : ''}`} />
      </div>
      {openSections[key] && (
        <>
          <hr className="section-divider" />
          <div className="section-content" style={{ paddingTop: '16px' }}>
            {content}
          </div>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="page-container-narrow">
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container-narrow">
      <div className="page-header">
        <button className="page-header-back" onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>
        <h1>Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {renderSection('personal', 'Personal Details', '👤', (
          <>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select name="gender" className="form-select" value={formData.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Bride">Bride</option>
                <option value="Groom">Groom</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dateOfBirth" className="form-input" value={formData.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input type="number" name="age" className="form-input" value={formData.age} onChange={handleChange} min="18" max="99" required />
              </div>
            </div>
            {renderNAInput('height', 'Height')}
            {renderNAInput('education', 'Education')}
            {renderNAInput('mobile', 'Mobile Number', 'tel')}
            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select name="maritalStatus" className="form-select" value={formData.maritalStatus} onChange={handleChange}>
                <option value="First Marriage">First Marriage</option>
                <option value="Second Marriage">Second Marriage</option>
              </select>
            </div>
            {formData.maritalStatus === 'Second Marriage' && (
              <>
                <div className="form-group">
                  <label className="form-label">Having Kids?</label>
                  <select name="havingKids" className="form-select" value={formData.havingKids} onChange={handleChange}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {formData.havingKids === 'Yes' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Number of Kids</label>
                      <input type="number" name="numberOfKids" className="form-input" value={formData.numberOfKids} onChange={handleChange} min="0" max="10" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Kids Details</label>
                      <textarea name="kidsDetails" className="form-textarea" value={formData.kidsDetails} onChange={handleChange} />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ))}

        {renderSection('family', 'Family Details', '👨‍👩‍👧‍👦', (
          <>
            <h4 className="mb-2" style={{ color: 'var(--gray-600)' }}>Father</h4>
            {renderNAInput('fatherName', 'Father Name')}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="fatherAlive" className="form-select" value={formData.fatherAlive} onChange={handleChange}>
                <option value="Alive">Alive</option>
                <option value="Not Alive">Not Alive</option>
              </select>
            </div>
            {renderNAInput('fatherOccupation', 'Father Occupation')}

            <h4 className="mb-2 mt-3" style={{ color: 'var(--gray-600)' }}>Mother</h4>
            {renderNAInput('motherName', 'Mother Name')}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="motherAlive" className="form-select" value={formData.motherAlive} onChange={handleChange}>
                <option value="Alive">Alive</option>
                <option value="Not Alive">Not Alive</option>
              </select>
            </div>
            {renderNAInput('motherOccupation', 'Mother Occupation')}

            <h4 className="mb-2 mt-3" style={{ color: 'var(--gray-600)' }}>Siblings</h4>
            <div className="form-group">
              <label className="form-label">Number of Brothers</label>
              <input type="number" className="form-input" value={formData.numberOfBrothers} onChange={(e) => handleBrothersChange(e.target.value)} min="0" max="10" />
            </div>
            {formData.brothers.map((b, i) => (
              <div key={`brother-${i}`} className="form-group" style={{ paddingLeft: '16px' }}>
                <label className="form-label">Brother {i + 1}</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name={`brother-${i}`} checked={b.status === 'Married'} onChange={() => handleSiblingStatusChange('brothers', i, 'Married')} /> Married
                  </label>
                  <label className="radio-label">
                    <input type="radio" name={`brother-${i}`} checked={b.status === 'Unmarried'} onChange={() => handleSiblingStatusChange('brothers', i, 'Unmarried')} /> Unmarried
                  </label>
                </div>
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Number of Sisters</label>
              <input type="number" className="form-input" value={formData.numberOfSisters} onChange={(e) => handleSistersChange(e.target.value)} min="0" max="10" />
            </div>
            {formData.sisters.map((s, i) => (
              <div key={`sister-${i}`} className="form-group" style={{ paddingLeft: '16px' }}>
                <label className="form-label">Sister {i + 1}</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name={`sister-${i}`} checked={s.status === 'Married'} onChange={() => handleSiblingStatusChange('sisters', i, 'Married')} /> Married
                  </label>
                  <label className="radio-label">
                    <input type="radio" name={`sister-${i}`} checked={s.status === 'Unmarried'} onChange={() => handleSiblingStatusChange('sisters', i, 'Unmarried')} /> Unmarried
                  </label>
                </div>
              </div>
            ))}
          </>
        ))}

        {renderSection('location', 'Location Details', '📍', (
          <>
            {renderNAInput('village', 'Village')}
            {renderNAInput('mandal', 'Mandal')}
            {renderNAInput('district', 'District')}
            {renderNAInput('state', 'State')}
            {renderNAInput('currentLocation', 'Current Location')}
            {renderNAInput('workingLocation', 'Working Location')}
          </>
        ))}

        {renderSection('job', 'Job Details', '💼', (
          <>
            {renderNAInput('occupation', 'Occupation')}
            {renderNAInput('organization', 'Organization / Company')}
            {renderNAInput('salary', 'Salary')}
            <div className="form-group">
              <label className="form-label">Salary Type</label>
              <select name="salaryType" className="form-select" value={formData.salaryType} onChange={handleChange}>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </>
        ))}

        {renderSection('assets', 'Assets', '🏠', (
          <>{renderNATextarea('assets', 'Assets', 'Enter assets like: 2 acres land, Own house, Car...')}</>
        ))}

        {renderSection('photos', 'Photos', '📸', (
          <>
            <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
              {totalPhotos}/4 photos
            </p>
            <div className="photo-upload-grid">
              {existingPhotos.map((photo, index) => {
                const src = typeof photo === 'string' ? photo : photo.url;
                return (
                  <div className="photo-upload-item" key={`existing-${index}`}>
                    <img src={src} alt={`Photo ${index + 1}`} />
                    <button type="button" className="photo-upload-remove" onClick={() => removeExistingPhoto(index)}>
                      <FiX />
                    </button>
                  </div>
                );
              })}
              {newPhotoPreviews.map((preview, index) => (
                <div className="photo-upload-item" key={`new-${index}`}>
                  <img src={preview} alt={`New ${index + 1}`} />
                  <button type="button" className="photo-upload-remove" onClick={() => removeNewPhoto(index)}>
                    <FiX />
                  </button>
                </div>
              ))}
              {totalPhotos < 4 && (
                <label className="photo-upload-add">
                  <FiCamera />
                  <span>Add Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} multiple />
                </label>
              )}
            </div>
          </>
        ))}

        {renderSection('mediator', 'Mediator Details', '🤝', (
          <>
            <h4 className="mb-2" style={{ color: 'var(--gray-600)' }}>Source Mediator</h4>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" name="sourceMediatorName" className="form-input" value={formData.sourceMediatorName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile</label>
              <input type="tel" name="sourceMediatorMobile" className="form-input" value={formData.sourceMediatorMobile} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" name="sourceMediatorLocation" className="form-input" value={formData.sourceMediatorLocation} onChange={handleChange} />
            </div>
            <h4 className="mb-2 mt-3" style={{ color: 'var(--gray-600)' }}>Mediator Chain</h4>
            <div className="form-group">
              <label className="form-label">Number of Mediators in Chain</label>
              <div className="d-flex align-center gap-2">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleMediatorsChange(formData.numberOfMediators - 1)} disabled={formData.numberOfMediators <= 0}><FiMinus /></button>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>{formData.numberOfMediators}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleMediatorsChange(formData.numberOfMediators + 1)} disabled={formData.numberOfMediators >= 10}><FiPlus /></button>
              </div>
            </div>
            {formData.mediators.map((m, i) => (
              <div key={`mediator-${i}`} className="card-flat mb-2">
                <h5 style={{ marginBottom: '8px', color: 'var(--primary)' }}>Mediator {i + 1}</h5>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" value={m.name} onChange={(e) => handleMediatorFieldChange(i, 'name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile</label>
                  <input type="tel" className="form-input" value={m.mobile} onChange={(e) => handleMediatorFieldChange(i, 'mobile', e.target.value)} />
                </div>
              </div>
            ))}
          </>
        ))}

        {renderSection('payment', 'Payment Details', '💰', (
          <>
            <div className="form-group">
              <label className="form-label">Commission Amount</label>
              <div className="input-prefix">
                <span className="prefix-symbol">₹</span>
                <input type="number" name="commissionAmount" className="form-input" value={formData.commissionAmount} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Registration Fee</label>
              <div className="input-prefix">
                <span className="prefix-symbol">₹</span>
                <input type="number" name="registrationFee" className="form-input" value={formData.registrationFee} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Paid?</label>
              <select name="isPaid" className="form-select" value={formData.isPaid} onChange={handleChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {formData.isPaid === 'Yes' && (
              <>
                <div className="form-group">
                  <label className="form-label">Amount Paid</label>
                  <div className="input-prefix">
                    <span className="prefix-symbol">₹</span>
                    <input type="number" name="amountPaid" className="form-input" value={formData.amountPaid} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Date</label>
                  <input type="date" name="paymentDate" className="form-input" value={formData.paymentDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Mode</label>
                  <input type="text" name="paymentMode" className="form-input" value={formData.paymentMode} onChange={handleChange} placeholder="e.g. Cash, UPI" />
                </div>
              </>
            )}
            <div className="form-group">
              <label className="form-label">Pending Amount</label>
              <div className="input-prefix">
                <span className="prefix-symbol">₹</span>
                <input type="text" className="form-input" value={pendingAmount} readOnly style={{ background: 'var(--gray-100)' }} />
              </div>
            </div>
          </>
        ))}

        {renderSection('expected', 'Expected Partner Details', '💑', (
          <>
            <div className="form-group">
              <label className="form-label">Age Range</label>
              <input type="text" name="expectedAgeRange" className="form-input" value={formData.expectedAgeRange} onChange={handleChange} placeholder="e.g. 25-30" />
            </div>
            {renderNAInput('expectedEducation', 'Education Preference')}
            {renderNAInput('expectedJobPreference', 'Job Preference')}
            {renderNAInput('expectedLocationPreference', 'Location Preference')}
            {renderNAInput('expectedSalary', 'Salary Expectation')}
            {renderNATextarea('otherRequirements', 'Other Requirements', 'Any other preferences...')}
          </>
        ))}

        <button type="submit" className="btn btn-primary btn-block mt-3" disabled={submitting} style={{ marginBottom: '24px' }}>
          {submitting ? 'Updating Profile...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
