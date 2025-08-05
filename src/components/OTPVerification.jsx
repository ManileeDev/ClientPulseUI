import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, RefreshCw } from 'lucide-react';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Get email from route state
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/');
      return;
    }

    // Start countdown for resend
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setError('Please enter the complete 4-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/validate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: parseInt(otpCode)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully!');
        
        // Show success message briefly then navigate to login
        setTimeout(() => {
          navigate('/', { 
            state: { 
              message: 'Account created successfully! Please log in with your credentials.',
              type: 'success',
              showLogin: true,
              forceLoginMode: true
            }
          });
        }, 2000);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');
    setCanResend(false);
    setCountdown(60);

    try {
      const response = await fetch('http://localhost:5000/api/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.success || data.message === "OTP has been generated") {
        setSuccess('New OTP sent to your email!');
        // Reset OTP inputs
        setOtp(['', '', '', '']);
        
        // Start countdown again
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-card">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
          type="button"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="otp-header">
          <div className="otp-icon">
            <Shield size={40} />
          </div>
          <h2>Verify Your Email</h2>
          <p>
            We've sent a 4-digit verification code to
            <br />
            <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="verify-button"
            disabled={loading || otp.join('').length !== 4}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        <div className="otp-footer">
          <p>Didn't receive the code?</p>
          {canResend ? (
            <button
              type="button"
              className="resend-button"
              onClick={handleResendOtp}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Resend OTP
            </button>
          ) : (
            <span className="countdown">
              Resend available in {countdown}s
            </span>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Import CSS variables from the main app */
        :root {
          --bg-gradient: linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #3b82f6 100%);
          --accent-primary: #0d9488;
          --accent-secondary: #06b6d4;
        }

        [data-theme="dark"] {
          --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          --accent-primary: #14b8a6;
          --accent-secondary: #22d3ee;
        }

        .otp-verification-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-gradient);
          padding: 20px;
        }

        .otp-verification-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background-color: #f3f4f6;
        }

        .otp-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .otp-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
          color: var(--accent-primary);
        }

        .otp-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .otp-header p {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .otp-inputs {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .otp-input {
          width: 56px;
          height: 56px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          transition: all 0.2s;
        }

        .otp-input:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        [data-theme="dark"] .otp-input:focus {
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
        }

        .otp-input:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }

        .error-message {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          text-align: center;
        }

        .success-message {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          text-align: center;
        }

        .verify-button {
          width: 100%;
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .verify-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .verify-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .otp-footer {
          text-align: center;
        }

        .otp-footer p {
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .resend-button {
          background: none;
          border: none;
          color: var(--accent-primary);
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 0 auto;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .resend-button:hover:not(:disabled) {
          background-color: #f3f4f6;
        }

        .countdown {
          color: #9ca3af;
          font-size: 14px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OTPVerification; 