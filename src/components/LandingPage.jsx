import { useState, useEffect } from 'react';
import { Activity, Heart, Star, Users, MessageSquare, SkipForward } from 'lucide-react';

const LandingPage = ({ onComplete }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showFloatingIcons, setShowFloatingIcons] = useState(false);

  useEffect(() => {
    // Animate elements in sequence
    const timeouts = [
      setTimeout(() => setShowLogo(true), 300),
      setTimeout(() => setShowTitle(true), 800),
      setTimeout(() => setShowDescription(true), 1300),
      setTimeout(() => setShowFloatingIcons(true), 1800),
      setTimeout(() => onComplete(), 5000) // Complete after 5 seconds
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="landing-page">
      {/* Skip button */}
      <button className="skip-button" onClick={onComplete} title="Skip intro">
        <SkipForward size={16} />
        Skip
      </button>

      {/* Background with gradient */}
      <div className="landing-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Main content */}
      <div className="landing-content">
        {/* Logo */}
        <div className={`logo-container ${showLogo ? 'animate-in' : ''}`}>
          <div className="logo-circle">
            <Activity size={48} className="logo-icon" />
          </div>
          <div className="logo-pulse"></div>
        </div>

        {/* Title */}
        <h1 className={`landing-title ${showTitle ? 'animate-in' : ''}`}>
          Client Pulse
        </h1>

        {/* Description */}
        <p className={`landing-description ${showDescription ? 'animate-in' : ''}`}>
          Capture feedback, track satisfaction, and build better products together
        </p>

        {/* Floating icons */}
        <div className={`floating-icons ${showFloatingIcons ? 'animate-in' : ''}`}>
          <div className="floating-icon icon-1">
            <Heart size={20} />
          </div>
          <div className="floating-icon icon-2">
            <Star size={18} />
          </div>
          <div className="floating-icon icon-3">
            <Users size={22} />
          </div>
          <div className="floating-icon icon-4">
            <MessageSquare size={20} />
          </div>
        </div>

        {/* Loading indicator */}
        <div className={`loading-indicator ${showDescription ? 'animate-in' : ''}`}>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <p className="loading-text">Preparing your experience...</p>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #3b82f6 100%);
          overflow: hidden;
          z-index: 9999;
        }

        .skip-button {
          position: absolute;
          top: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .skip-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }

        .skip-button:active {
          transform: translateY(0);
        }

        .landing-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0.3;
          animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.2);
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.15);
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.1);
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        .landing-content {
          text-align: center;
          color: white;
          position: relative;
          z-index: 2;
        }

        .logo-container {
          position: relative;
          margin-bottom: 2rem;
          opacity: 0;
          transform: scale(0.5) translateY(50px);
          transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .logo-container.animate-in {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .logo-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          animation: glow 2s ease-in-out infinite alternate;
        }

        .logo-icon {
          color: white;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .logo-pulse {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.4);
          animation: pulse 2s ease-out infinite;
        }

        .landing-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out 0.2s;
        }

        .landing-title.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .landing-description {
          font-size: 1.25rem;
          font-weight: 400;
          margin: 0 0 3rem 0;
          opacity: 0.9;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out 0.4s;
        }

        .landing-description.animate-in {
          opacity: 0.9;
          transform: translateY(0);
        }

        .floating-icons {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          opacity: 0;
          transition: opacity 0.8s ease-out;
        }

        .floating-icons.animate-in {
          opacity: 1;
        }

        .floating-icon {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          animation: floatAround 8s ease-in-out infinite;
        }

        .icon-1 {
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 0s;
        }

        .icon-2 {
          top: 50%;
          right: 10%;
          transform: translateY(-50%);
          animation-delay: 2s;
        }

        .icon-3 {
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 4s;
        }

        .icon-4 {
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          animation-delay: 6s;
        }

        .loading-indicator {
          margin-top: 4rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out 0.6s;
        }

        .loading-indicator.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .loading-bar {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          margin: 0 auto 1rem;
          overflow: hidden;
        }

        .loading-progress {
          height: 100%;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.9));
          border-radius: 2px;
          animation: loading 5s ease-out forwards;
        }

        .loading-text {
          font-size: 0.9rem;
          opacity: 0.8;
          margin: 0;
          letter-spacing: 0.5px;
        }

        /* Animations */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          100% {
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4);
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes floatAround {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(90deg);
          }
          50% {
            transform: translateY(5px) rotate(180deg);
          }
          75% {
            transform: translateY(-5px) rotate(270deg);
          }
        }

        @keyframes loading {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .skip-button {
            top: 1.5rem;
            right: 1.5rem;
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }
          
          .landing-title {
            font-size: 2.5rem;
          }
          
          .landing-description {
            font-size: 1.1rem;
            padding: 0 1rem;
          }
          
          .logo-circle {
            width: 100px;
            height: 100px;
          }
          
          .logo-icon {
            width: 40px;
            height: 40px;
          }
          
          .floating-icons {
            width: 300px;
            height: 300px;
          }
          
          .floating-icon {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .skip-button {
            top: 1rem;
            right: 1rem;
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }
          
          .landing-title {
            font-size: 2rem;
          }
          
          .landing-description {
            font-size: 1rem;
          }
          
          .logo-circle {
            width: 80px;
            height: 80px;
          }
          
          .floating-icons {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 