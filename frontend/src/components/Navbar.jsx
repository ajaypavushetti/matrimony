import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiSearch, FiUser } from 'react-icons/fi';

function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/add-profile', icon: FiPlusCircle, label: 'Add' },
    { path: '/search', icon: FiSearch, label: 'Search', onClick: () => {} },
    { path: '/my-profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="top-nav">
        <NavLink to="/" className="top-nav-brand">
          💍 Matrimony Mediator
        </NavLink>
        <div className="top-nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}
          >
            <FiHome /> Home
          </NavLink>
          <NavLink
            to="/add-profile"
            className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}
          >
            <FiPlusCircle /> Add Profile
          </NavLink>
          <NavLink
            to="/my-profile"
            className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}
          >
            <FiUser /> My Profile
          </NavLink>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

          if (item.path === '/search') {
            return (
              <NavLink
                key={item.path}
                to="/"
                className={`bottom-nav-item`}
              >
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}

export default Navbar;
