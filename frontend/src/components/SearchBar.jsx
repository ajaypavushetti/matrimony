import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';

function SearchBar({ onSearch, placeholder = 'Search profiles...' }) {
  const [query, setQuery] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, onSearch]);

  return (
    <div className="search-bar">
      <FiSearch className="search-bar-icon" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBar;
