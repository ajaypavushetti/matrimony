import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiUser, FiBriefcase, FiMapPin, FiPhone, FiDollarSign, FiHeart, FiHome as FiHomeIcon } from 'react-icons/fi';
import API from '../api/axios';
import PhotoSlider from '../components/PhotoSlider';
import MediatorChain from '../components/MediatorChain';
import ShareButton from '../components/ShareButton';
import { useToast } from '../components/Toast';

function ProfileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/api/profiles/${id}`);
      setProfile(res.data.profile);
    } catch (err) {
      showError('Failed to load profile');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/api/profiles/${id}`);
      showSuccess('Profile deleted successfully');
      navigate('/');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete profile');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const displayValue = (val) => {
    if (!val || val === 'NA' || val === 'undefined' || val === '') return '—';
    return val;
  };

  if (loading) {
    return (
      <div className="page-container-narrow">
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const genderClass = profile.gender === 'Bride' ? 'badge-bride' : 'badge-groom';
  const marriageClass = profile.maritalStatus === 'Second Marriage' ? 'badge-second-marriage' : 'badge-first-marriage';
  const pendingAmount = Math.max(0, (profile.registrationFee || 0) - (profile.amountPaid || 0));

  return (
    <div className="page-container-narrow">
      <div className="page-header">
        <button className="page-header-back" onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>
        <h1>Profile Details</h1>
      </div>

      {/* Photo Slider */}
      <PhotoSlider photos={profile.photos} name={profile.name} />

      {/* Name & Badges */}
      <div className="card mt-3">
        <h2 style={{ marginBottom: '8px' }}>{profile.name}</h2>
        <div className="d-flex flex-wrap gap-2 align-center">
          <span className={`badge ${genderClass}`}>{profile.gender}</span>
          {profile.age && <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{profile.age} years</span>}
          {profile.maritalStatus && <span className={`badge ${marriageClass}`}>{profile.maritalStatus}</span>}
        </div>
      </div>

      {/* Personal Details */}
      <div className="detail-section mt-3">
        <div className="detail-section-title">
          <FiUser /> Personal Details
        </div>
        <div className="detail-row">
          <div className="detail-label">Name</div>
          <div className="detail-value">{displayValue(profile.name)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Gender</div>
          <div className="detail-value">{displayValue(profile.gender)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Age</div>
          <div className="detail-value">{displayValue(profile.age)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Date of Birth</div>
          <div className="detail-value">
            {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN') : '—'}
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Height</div>
          <div className="detail-value">{displayValue(profile.height)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Education</div>
          <div className="detail-value">{displayValue(profile.education)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Mobile</div>
          <div className="detail-value">
            {profile.mobile && profile.mobile !== 'NA' ? (
              <a href={`tel:${profile.mobile}`}>{profile.mobile}</a>
            ) : '—'}
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Marital Status</div>
          <div className="detail-value">{displayValue(profile.maritalStatus)}</div>
        </div>
        {profile.maritalStatus === 'Second Marriage' && (
          <>
            <div className="detail-row">
              <div className="detail-label">Having Kids</div>
              <div className="detail-value">{displayValue(profile.havingKids)}</div>
            </div>
            {profile.havingKids === 'Yes' && (
              <>
                <div className="detail-row">
                  <div className="detail-label">Number of Kids</div>
                  <div className="detail-value">{profile.numberOfKids || '—'}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Kids Details</div>
                  <div className="detail-value">{displayValue(profile.kidsDetails)}</div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Family Details */}
      <div className="detail-section">
        <div className="detail-section-title">
          <FiUser /> Family Details
        </div>
        <div className="detail-row">
          <div className="detail-label">Father</div>
          <div className="detail-value">
            {displayValue(profile.fatherName)}
            {profile.fatherAlive && profile.fatherAlive !== 'NA' && ` (${profile.fatherAlive})`}
            {profile.fatherOccupation && profile.fatherOccupation !== 'NA' && ` — ${profile.fatherOccupation}`}
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Mother</div>
          <div className="detail-value">
            {displayValue(profile.motherName)}
            {profile.motherAlive && profile.motherAlive !== 'NA' && ` (${profile.motherAlive})`}
            {profile.motherOccupation && profile.motherOccupation !== 'NA' && ` — ${profile.motherOccupation}`}
          </div>
        </div>
        {profile.numberOfBrothers > 0 && (
          <div className="detail-row">
            <div className="detail-label">Brothers</div>
            <div className="detail-value">
              {profile.numberOfBrothers} —{' '}
              {profile.brothers && profile.brothers.map((b, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  Brother {i + 1}: {b.status}
                </span>
              ))}
            </div>
          </div>
        )}
        {profile.numberOfSisters > 0 && (
          <div className="detail-row">
            <div className="detail-label">Sisters</div>
            <div className="detail-value">
              {profile.numberOfSisters} —{' '}
              {profile.sisters && profile.sisters.map((s, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  Sister {i + 1}: {s.status}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className="detail-section">
        <div className="detail-section-title">
          <FiBriefcase /> Job Details
        </div>
        <div className="detail-row">
          <div className="detail-label">Occupation</div>
          <div className="detail-value">{displayValue(profile.occupation)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Organization</div>
          <div className="detail-value">{displayValue(profile.organization)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Salary</div>
          <div className="detail-value">
            {profile.salary && profile.salary !== 'NA'
              ? `₹${profile.salary} (${profile.salaryType || 'Monthly'})`
              : '—'}
          </div>
        </div>
      </div>

      {/* Assets */}
      {profile.assets && profile.assets !== 'NA' && (
        <div className="detail-section">
          <div className="detail-section-title">
            <FiHomeIcon /> Assets
          </div>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{profile.assets}</p>
        </div>
      )}

      {/* Location */}
      <div className="detail-section">
        <div className="detail-section-title">
          <FiMapPin /> Location
        </div>
        <div className="detail-row">
          <div className="detail-label">Village</div>
          <div className="detail-value">{displayValue(profile.village)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Mandal</div>
          <div className="detail-value">{displayValue(profile.mandal)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">District</div>
          <div className="detail-value">{displayValue(profile.district)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">State</div>
          <div className="detail-value">{displayValue(profile.state)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Current Location</div>
          <div className="detail-value">{displayValue(profile.currentLocation)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Working Location</div>
          <div className="detail-value">{displayValue(profile.workingLocation)}</div>
        </div>
      </div>

      {/* Mediator Details */}
      <div className="detail-section">
        <div className="detail-section-title">
          <FiPhone /> Mediator Chain
        </div>
        <MediatorChain
          sourceMediator={profile.sourceMediator}
          mediators={profile.mediators}
        />
      </div>

      {/* Payment Details */}
      <div className="detail-section">
        <div className="detail-section-title">
          <FiDollarSign /> Payment Details
        </div>
        <div className="detail-row">
          <div className="detail-label">Commission</div>
          <div className="detail-value">₹{profile.commissionAmount || 0}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Registration Fee</div>
          <div className="detail-value">₹{profile.registrationFee || 0}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Payment Status</div>
          <div className="detail-value">
            <span className={`badge ${profile.isPaid ? 'badge-paid' : 'badge-pending'}`}>
              {profile.isPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
        {profile.isPaid && (
          <>
            <div className="detail-row">
              <div className="detail-label">Amount Paid</div>
              <div className="detail-value">₹{profile.amountPaid || 0}</div>
            </div>
            {profile.paymentDate && (
              <div className="detail-row">
                <div className="detail-label">Payment Date</div>
                <div className="detail-value">{new Date(profile.paymentDate).toLocaleDateString('en-IN')}</div>
              </div>
            )}
            {profile.paymentMode && (
              <div className="detail-row">
                <div className="detail-label">Payment Mode</div>
                <div className="detail-value">{profile.paymentMode}</div>
              </div>
            )}
          </>
        )}
        <div className="detail-row">
          <div className="detail-label">Pending Amount</div>
          <div className="detail-value" style={{ color: pendingAmount > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
            ₹{pendingAmount}
          </div>
        </div>
      </div>

      {/* Expected Partner */}
      <div className="detail-section">
        <div className="detail-section-title">
          <FiHeart /> Expected Partner
        </div>
        <div className="detail-row">
          <div className="detail-label">Age Range</div>
          <div className="detail-value">{displayValue(profile.expectedAgeRange)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Education</div>
          <div className="detail-value">{displayValue(profile.expectedEducation)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Job Preference</div>
          <div className="detail-value">{displayValue(profile.expectedJobPreference)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Location</div>
          <div className="detail-value">{displayValue(profile.expectedLocationPreference)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Salary Expectation</div>
          <div className="detail-value">{displayValue(profile.expectedSalary)}</div>
        </div>
        {profile.otherRequirements && profile.otherRequirements !== 'NA' && (
          <div className="detail-row">
            <div className="detail-label">Other</div>
            <div className="detail-value">{profile.otherRequirements}</div>
          </div>
        )}
      </div>

      {/* Share */}
      <div className="mb-3">
        <ShareButton profile={profile} />
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="btn btn-primary" onClick={() => navigate(`/edit-profile/${id}`)}>
          <FiEdit2 /> Edit
        </button>
        <button className="btn btn-danger" onClick={() => setShowDeleteDialog(true)}>
          <FiTrash2 /> Delete
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay" onClick={() => setShowDeleteDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Profile</h3>
            <p>Are you sure you want to delete {profile.name}&apos;s profile? This action cannot be undone.</p>
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDetails;
