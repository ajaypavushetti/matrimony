import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import API from '../api/axios';
import ProfileCard from '../components/ProfileCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';

function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [marriageFilter, setMarriageFilter] = useState('All');
  const navigate = useNavigate();

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (genderFilter !== 'All') params.gender = genderFilter;
      if (marriageFilter !== 'All') params.marriageType = marriageFilter;

      const res = await API.get('/api/profiles', { params });
      setProfiles(res.data.profiles || []);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, genderFilter, marriageFilter]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="page-container">
      <div className="home-header">
        <div className="home-header-top">
          <div>
            <h1>💍 Matrimony Mediator</h1>
            <div className="home-header-subtitle">
              {profiles.length} profile{profiles.length !== 1 ? 's' : ''} managed
            </div>
          </div>
        </div>
        <SearchBar onSearch={handleSearch} />
        <FilterPanel
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          marriageFilter={marriageFilter}
          setMarriageFilter={setMarriageFilter}
        />
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>
            {searchQuery || genderFilter !== 'All' || marriageFilter !== 'All'
              ? 'No matching profiles'
              : 'No profiles yet'}
          </h3>
          <p>
            {searchQuery || genderFilter !== 'All' || marriageFilter !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Add your first profile to get started!'}
          </p>
        </div>
      ) : (
        <div className="profile-grid">
          {profiles.map((profile) => (
            <ProfileCard key={profile._id} profile={profile} />
          ))}
        </div>
      )}

      <button
        className="fab"
        onClick={() => navigate('/add-profile')}
        aria-label="Add new profile"
      >
        <FiPlus />
      </button>
    </div>
  );
}

export default Home;
