import { useState, useEffect } from 'react'
import { Send, Star, Heart, ThumbsUp, Meh, ThumbsDown, LogIn, AlertCircle, Loader } from 'lucide-react'
import { feedbackAPI, configAPI, featureAPI } from '../services/api'

const ClientFeedback = ({ user, onOpenAuth }) => {
  const [selectedFeature, setSelectedFeature] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('medium')
  const [rating, setRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')
  
  // Dynamic data from API
  const [features, setFeatures] = useState([])
  const [categories, setCategories] = useState([])
  const [priorityOptions, setPriorityOptions] = useState([])
  const [ratingOptions, setRatingOptions] = useState([])
  const [loading, setLoading] = useState(true)

  // Load configuration data on component mount
  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        setLoading(true)
        const [featuresRes, categoriesRes, prioritiesRes, ratingsRes] = await Promise.all([
          featureAPI.getAll(),
          configAPI.getFeedbackCategories(),
          configAPI.getPriorityOptions(),
          configAPI.getRatingOptions()
        ])

        // Transform API data to component format
        if (featuresRes.success) {
          setFeatures(featuresRes.features.filter(feature => !feature.isArchived))
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories.map(cat => ({
            value: cat.value,
            label: cat.name,
            description: cat.description
          })))
        }

        if (prioritiesRes.success) {
          setPriorityOptions(prioritiesRes.priorities.map(pri => ({
            value: pri.value,
            label: pri.name,
            color: pri.metadata?.color || '#6B7280'
          })))
        }

        if (ratingsRes.success) {
          // Direct mapping by rating value to ensure correct emojis
          const ratingEmojiMap = {
            5: '😍',  // Excellent
            4: '👍',  // Good  
            3: '😐',  // Okay
            2: '👎',  // Poor
            1: '😢'   // Very Poor
          }
          
          const mappedRatings = ratingsRes.ratings.map(rating => ({
            value: rating.value,
            emoji: ratingEmojiMap[rating.value] || '😍',
            label: rating.name,
            color: rating.metadata?.color || '#6B7280'
          })).sort((a, b) => b.value - a.value)
          
          setRatingOptions(mappedRatings)
        }



      } catch (err) {
        console.error('Failed to load configurations:', err)
        setError('Failed to load form options. Please refresh the page.')
        
        // Fallback to static data if API fails
        setFeatures([
          { _id: '1', name: 'Sample Feature 1', status: 'completed' },
          { _id: '2', name: 'Sample Feature 2', status: 'planned' }
        ])
        
        setCategories([
          { value: 'bug_report', label: 'Bug Report', description: 'Report a bug or issue' },
          { value: 'feature_request', label: 'Feature Request', description: 'Suggest a new feature' },
          { value: 'ui_ux', label: 'UI/UX Feedback', description: 'Interface and user experience' },
          { value: 'performance', label: 'Performance', description: 'Speed, loading, or performance issues' },
          { value: 'general', label: 'General Feedback', description: 'Other feedback or suggestions' }
        ])
        
        setPriorityOptions([
          { value: 'low', label: 'Low', color: '#10B981' },
          { value: 'medium', label: 'Medium', color: '#F59E0B' },
          { value: 'high', label: 'High', color: '#EF4444' }
        ])
        
        const fallbackRatings = [
          { value: 5, emoji: '😍', label: 'Excellent', color: '#10B981' },
          { value: 4, emoji: '👍', label: 'Good', color: '#3B82F6' },
          { value: 3, emoji: '😐', label: 'Okay', color: '#F59E0B' },
          { value: 2, emoji: '👎', label: 'Poor', color: '#EF4444' },
          { value: 1, emoji: '😢', label: 'Very Poor', color: '#7F1D1D' }
        ]
        
        setRatingOptions(fallbackRatings)

      } finally {
        setLoading(false)
      }
    }

    fetchConfigurations()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      setError('Please sign in to submit feedback')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const feedbackData = {
        featureId: selectedFeature,
        description,
        category,
        priority,
        rating,
        clientId: user._id,
        clientName: user.name // Add client name from user object
      }
      
      const response = await feedbackAPI.create(feedbackData)
      
      if (response.success) {
        setShowSuccess(true)
        
        // Reset form after success
        setTimeout(() => {
          setSelectedFeature('')
          setDescription('')
          setCategory('')
          setPriority('medium')
          setRating(0)
          setShowSuccess(false)
        }, 3000)
      }
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Thank You! 🎉</h1>
        <p className="page-subtitle">Your feedback has been sent to the development team</p>
        
        <div className="card">
          <div className="text-center">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ color: '#10B981', marginBottom: '1rem' }}>Feedback Submitted Successfully!</h2>
            <p style={{ color: '#4a5568' }}>
              The development team will review your feedback and use it to improve future deliveries.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Share Your Feedback</h1>
        <p className="page-subtitle">Help us improve by sharing your thoughts</p>
        
        <div className="card">
          <div className="text-center">
            <LogIn size={48} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Sign In Required</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Please sign in to submit feedback. This helps us track and respond to your suggestions.
            </p>
            <button 
              className="btn-primary auth-prompt-btn"
              onClick={onOpenAuth}
            >
              <LogIn size={20} />
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while fetching configurations
  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Share Your Feedback</h1>
        <p className="page-subtitle">Help us improve by sharing your thoughts • Signed in as {user.name}</p>
        
        <div className="card">
          <div className="text-center">
            <Loader className="animate-spin" size={32} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading feedback form...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <h1 className="page-title">Share Your Feedback</h1>
      <p className="page-subtitle">Help us improve by sharing your thoughts • Signed in as {user.name}</p>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Feature Selection */}
          <div className="form-group">
            <label className="form-label">Select Feature</label>
            <select 
              className="form-select"
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              required
            >
              <option value="">Choose a feature to give feedback on...</option>
              {features.map(feature => (
                <option key={feature._id} value={feature._id}>
                  {feature.name} ({feature.status})
                </option>
              ))}
            </select>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Select the feature you want to provide feedback about
            </p>
          </div>



          {/* Category Selection */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} - {cat.description}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Describe your feedback in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Priority Selection */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-group">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`priority-btn ${priority === option.value ? 'active' : ''}`}
                  onClick={() => setPriority(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Selection */}
          <div className="form-group">
            <label className="form-label">How do you feel about this feature? 😊 (Optional)</label>
            <div className="rating-group">
              {ratingOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`rating-btn ${rating === option.value ? 'active' : ''}`}
                  onClick={() => setRating(option.value)}
                  style={rating === option.value ? { 
                    borderColor: option.color, 
                    backgroundColor: option.color,
                    transform: 'scale(1.15)',
                    boxShadow: `0 4px 15px ${option.color}30`
                  } : {}}
                  title={`${option.value} - ${option.label}`}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary)', 
              marginTop: '0.5rem',
              textAlign: 'center'
            }}>
              Click an emoji to rate your experience
            </p>
            {rating > 0 && (
              <p style={{ 
                marginTop: '0.5rem', 
                color: ratingOptions.find(r => r.value === rating)?.color,
                fontWeight: '600',
                textAlign: 'center',
                fontSize: '1rem'
              }}>
                {ratingOptions.find(r => r.value === rating)?.emoji} {ratingOptions.find(r => r.value === rating)?.label}
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div style={{ marginTop: '2rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!selectedFeature || !category || !description || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .text-center {
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default ClientFeedback 