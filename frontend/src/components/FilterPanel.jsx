function FilterPanel({ genderFilter, setGenderFilter, marriageFilter, setMarriageFilter }) {
  const genderOptions = ['All', 'Bride', 'Groom'];
  const marriageOptions = ['All', 'First Marriage', 'Second Marriage'];

  return (
    <div>
      <div className="filter-panel">
        {genderOptions.map((option) => (
          <button
            key={option}
            className={`filter-chip ${genderFilter === option ? 'active' : ''}`}
            onClick={() => setGenderFilter(option)}
          >
            {option === 'Bride' ? '👰 ' : option === 'Groom' ? '🤵 ' : ''}{option}
          </button>
        ))}
      </div>
      <div className="filter-panel">
        {marriageOptions.map((option) => (
          <button
            key={option}
            className={`filter-chip ${marriageFilter === option ? 'active' : ''}`}
            onClick={() => setMarriageFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterPanel;
