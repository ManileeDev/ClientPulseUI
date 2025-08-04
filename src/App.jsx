import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Activity, Users, MessageSquare, BarChart3, Settings, Moon, Sun, LogIn, FileText } from 'lucide-react'
import ClientFeedback from './components/ClientFeedback'
import DeveloperDashboard from './components/DeveloperDashboard'
import FeatureList from './components/FeatureList'
import Analytics from './components/Analytics'
import AuthModal from './components/AuthModal'
import ProfileMenu from './components/ProfileMenu'
import MyFeedbacks from './components/MyFeedbacks'
import OTPVerification from './components/OTPVerification'
import CreateFeature from './components/CreateFeature'
import FeatureManagement from './components/FeatureManagement'
import './App.css'

function AppContent() {
  const [user, setUser] = useState(null) // Authenticated user
  const [userRole, setUserRole] = useState('client') // 'client' or 'developer'
  const [theme, setTheme] = useState('light') // 'light' or 'dark'
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCreateFeature, setShowCreateFeature] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Toast functionality
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Make showToast globally available
  useEffect(() => {
    window.showToast = showToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  // Load theme and user from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)

    // Check for saved user session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setUserRole(userData.role)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('user')
      }
    }

    // Check for route state messages
    if (location.state?.message) {
      showToast(location.state.message, location.state.type || 'info');
      
      // If showLogin is true, open the auth modal
      if (location.state.showLogin) {
        setTimeout(() => {
          setShowAuthModal(true);
        }, 1000);
      }
      
      // Clear the state to prevent showing on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate])

  // Update theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Authentication handlers
  const handleAuthSuccess = (userData) => {
    console.log('Authentication success, user data:', userData);
    console.log('User ID field:', userData._id || userData.id);
    setUser(userData)
    setUserRole(userData.role)
    
    // Store user data with token
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Show success toast
    showToast('Logged in successfully!', 'success');
    
    // Navigate to default route for user's role
    if (userData.role === 'client') {
      navigate('/')
    } else {
      navigate('/dashboard')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setUserRole('client')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleRoleChange = (newRole) => {
    // Only allow role change if user has that role or is not authenticated
    if (!user || user.role === newRole) {
      setUserRole(newRole)
      // Navigate to the default route for the selected role
      if (newRole === 'client') {
        navigate('/')
      } else {
        navigate('/dashboard')
      }
    }
  }



  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Activity className="logo-icon" />
            <h1>Client Pulse</h1>
          </div>
          
          <div className="header-controls">
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {/* Show role toggle only if user is not authenticated or has multiple roles */}
            {!user && (
              <div className="role-toggle">
                <button 
                  className={`role-btn ${userRole === 'client' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('client')}
                >
                  <Users size={16} />
                  Client View
                </button>
                <button 
                  className={`role-btn ${userRole === 'developer' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('developer')}
                >
                  <Settings size={16} />
                  Developer View
                </button>
              </div>
            )}
            
            {/* Authentication UI */}
            {user ? (
              <ProfileMenu user={user} onLogout={handleLogout} />
            ) : (
              <button 
                className="login-btn"
                onClick={() => setShowAuthModal(true)}
              >
                <LogIn size={16} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          {userRole === 'client' ? (
            <>
              <NavLink to="/" className="nav-link">
                <MessageSquare size={18} />
                Give Feedback
              </NavLink>
              <NavLink to="/features" className="nav-link">
                <BarChart3 size={18} />
                Features
              </NavLink>
              <NavLink to="/analytics" className="nav-link">
                <BarChart3 size={18} />
                Analytics
              </NavLink>
              {user && (
                <NavLink to="/my-feedbacks" className="nav-link">
                  <FileText size={18} />
                  My Feedbacks
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className="nav-link">
                <BarChart3 size={18} />
                Dashboard
              </NavLink>
              <NavLink to="/features" className="nav-link">
                <Settings size={18} />
                Features
              </NavLink>
              <NavLink to="/analytics" className="nav-link">
                <BarChart3 size={18} />
                Analytics
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <Routes>
          {/* OTP Verification Route (always available) */}
          <Route 
            path="/verify-otp" 
            element={<OTPVerification />} 
          />
          
          {userRole === 'client' ? (
            <>
              <Route path="/" element={<ClientFeedback user={user} onOpenAuth={() => setShowAuthModal(true)} />} />
              <Route path="/features" element={<FeatureList />} />
              <Route path="/analytics" element={<Analytics user={user} />} />
              {user && (
                <Route path="/my-feedbacks" element={<MyFeedbacks user={user} onOpenAuth={() => setShowAuthModal(true)} />} />
              )}
            </>
          ) : (
            <>
              <Route path="/" element={<DeveloperDashboard user={user} onCreateFeature={() => setShowCreateFeature(true)} />} />
              <Route path="/dashboard" element={<DeveloperDashboard user={user} onCreateFeature={() => setShowCreateFeature(true)} />} />
              <Route path="/features" element={<FeatureManagement user={user} />} />
              <Route path="/analytics" element={<Analytics user={user} />} />
            </>
          )}
        </Routes>
      </main>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Create Feature Modal */}
      {showCreateFeature && userRole === 'developer' && (
        <CreateFeature
          user={user}
          onFeatureCreated={(feature) => {
            showToast('Feature created successfully!', 'success');
            setShowCreateFeature(false);
          }}
          onClose={() => setShowCreateFeature(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}>×</button>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
