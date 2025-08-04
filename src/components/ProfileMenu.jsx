import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown, X } from 'lucide-react';

const ProfileMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'developer':
        return 'var(--accent-primary)';
      case 'client':
        return '#0d9488';
      case 'admin':
        return '#EF4444';
      default:
        return 'var(--text-primary)';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'developer':
        return 'Developer';
      case 'client':
        return 'Client';
      default:
        return role;
    }
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="profile-avatar">
          {getInitials(user.name)}
        </div>
        <div className="profile-info">
          <span className="profile-name">{user.name}</span>
          <span 
            className="profile-role"
            style={{ color: getRoleColor(user.role) }}
          >
            {getRoleLabel(user.role)}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`profile-chevron ${isOpen ? 'open' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div className="profile-dropdown-overlay mobile-only" onClick={() => setIsOpen(false)}></div>
          <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="profile-dropdown-header">
            <button 
              className="profile-close-btn mobile-only"
              onClick={() => setIsOpen(false)}
              aria-label="Close profile menu"
            >
              <X size={20} />
            </button>
            <div className="profile-avatar-large">
              {getInitials(user.name)}
            </div>
            <div className="profile-details">
              <h3 className="profile-dropdown-name">{user.name}</h3>
              <p className="profile-dropdown-email">{user.email}</p>
              <span 
                className="profile-dropdown-role"
                style={{ color: getRoleColor(user.role) }}
              >
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>

          <div className="profile-dropdown-divider"></div>

          <div className="profile-dropdown-menu">
            <button className="profile-menu-item" disabled>
              <User size={16} />
              <span>Profile Settings</span>
              <span className="coming-soon">Soon</span>
            </button>
            
            <button className="profile-menu-item" disabled>
              <Settings size={16} />
              <span>Account Settings</span>
              <span className="coming-soon">Soon</span>
            </button>
          </div>

          <div className="profile-dropdown-divider"></div>

          <button 
            className="profile-menu-item logout-item"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu; 