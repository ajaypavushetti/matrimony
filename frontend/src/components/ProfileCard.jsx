import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiMapPin, FiHome } from 'react-icons/fi';

function ProfileCard({ profile }) {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Photos are objects with {url, publicId}
  const photoUrl = profile.photos && profile.photos.length > 0
    ? profile.photos[0].url
    : null;

  const genderClass = profile.gender === 'Bride' ? 'badge-bride' : 'badge-groom';
  const marriageClass = profile.maritalStatus === 'Second Marriage' ? 'badge-second-marriage' : 'badge-first-marriage';

  return (
    <div className="profile-card" onClick={() => navigate(`/profile/${profile._id}`)}>
      {photoUrl ? (
        <img src={photoUrl} alt={profile.name} className="profile-card-photo" />
      ) : (
        <div className="profile-card-avatar">
          {getInitials(profile.name)}
        </div>
      )}
      <div className="profile-card-body">
        <div className="profile-card-name">{profile.name}</div>
        <div className="profile-card-meta">
          <span className={`badge ${genderClass}`}>{profile.gender}</span>
          {profile.age && <span style={{ fontSize: '0.85rem', color: '#707070' }}>{profile.age} yrs</span>}
          {profile.maritalStatus && (
            <span className={`badge ${marriageClass}`}>{profile.maritalStatus}</span>
          )}
        </div>
        {profile.occupation && profile.occupation !== 'NA' && (
          <div className="profile-card-info">
            <FiBriefcase /> {profile.occupation}
          </div>
        )}
        {profile.workingLocation && profile.workingLocation !== 'NA' && (
          <div className="profile-card-info">
            <FiMapPin /> {profile.workingLocation}
          </div>
        )}
        {profile.village && profile.village !== 'NA' && (
          <div className="profile-card-info">
            <FiHome /> {profile.village}
            {profile.district && profile.district !== 'NA' ? `, ${profile.district}` : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;
