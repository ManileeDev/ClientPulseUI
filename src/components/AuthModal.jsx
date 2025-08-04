import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { authAPI } from '../services/api';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('AuthModal: Form submission started', { isLogin, formData });
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        console.log('AuthModal: Attempting login...');
        response = await authAPI.login({
          email: formData.email,
          password: formData.password
        });

        if (response.success) {
          console.log('AuthModal: Login success - calling onAuthSuccess');
          console.log('AuthModal: Token in response:', response.token ? 'Yes' : 'No');
          
          // Pass both user data and token
          const userDataWithToken = {
            ...response.user,
            token: response.token
          };
          
          onAuthSuccess(userDataWithToken);
          onClose();
          setFormData({ name: '', email: '', password: '', role: 'client' });
        } else {
          setError(response.message || 'Login failed');
        }
      } else {
        console.log('AuthModal: Attempting registration...');
        response = await authAPI.register({
          fullname: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        if (response.success && response.otpSent) {
          console.log('AuthModal: Registration initiated - OTP sent');
          
          // Show success toast for OTP sent
          if (window.showToast) {
            window.showToast('OTP sent to your email! Please check your inbox.', 'success');
          }
          
          // Close modal and navigate to OTP verification
          onClose();
          setFormData({ name: '', email: '', password: '', role: 'client' });
          
          // Navigate to OTP verification page
          setTimeout(() => {
            navigate('/verify-otp', { 
              state: { email: formData.email } 
            });
          }, 500);
          
        } else {
          setError(response.message || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('AuthModal: Error caught:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', role: 'client' });
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-modal-container">
        <div className="auth-modal-card">
          {/* Close Button */}
          <button className="auth-close-btn" onClick={onClose}>
            <X size={20} />
          </button>

          {/* Left Panel - Decorative */}
          <div className="auth-left-panel">
            <div className="auth-welcome-content">
              <div className="auth-icon-large">
                {isLogin ? <LogIn size={40} /> : <UserPlus size={40} />}
              </div>
              <h2 className="auth-welcome-title">
                {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
              </h2>
              <p className="auth-welcome-subtitle">
                {isLogin 
                  ? 'Sign in to continue your journey with us' 
                  : 'Create an account and start sharing your feedback'
                }
              </p>
            </div>
            
            {/* Decorative Elements */}
            <div className="auth-decoration">
              <div className="auth-cloud auth-cloud-1"></div>
              <div className="auth-cloud auth-cloud-2"></div>
              <div className="auth-cloud auth-cloud-3"></div>
              <div className="auth-wave"></div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="auth-right-panel">
            <div className="auth-form-header">
              <h3 className="auth-form-title">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h3>
              <p className="auth-form-subtitle">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Fill in your information to get started'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Full Name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="form-input form-select"
                  >
                    <option value="client">Client - Share Feedback</option>
                    <option value="developer">Developer - Manage Projects</option>
                  </select>
                </div>
              )}

              {error && (
                <div className="form-error">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="form-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch">
              <p className="switch-text">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  className="switch-link"
                  onClick={switchMode}
                >
                  {isLogin ? 'Create account' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 