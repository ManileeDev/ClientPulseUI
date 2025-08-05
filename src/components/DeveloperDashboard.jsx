import { useState, useEffect } from 'react'
import { TrendingUp, Users, MessageSquare, Star, Filter, Calendar, User, UserX, Heart, ThumbsUp, Meh, ThumbsDown, AlertCircle, Loader } from 'lucide-react'
import { feedbackAPI } from '../services/api'

const DeveloperDashboard = ({ user, onCreateFeature }) => {
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Remove static data - will be fetched from API

  // Fetch feedback from API
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await feedbackAPI.getAll()
        if (response.success) {
          setFeedback(response.feedback)
        }
      } catch (err) {
        setError('Failed to load feedback data')
        console.error('Feedback fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  const ratingEmojis = {
    5: { emoji: '😍', color: '#10B981', label: 'Excellent' },
    4: { emoji: '👍', color: '#3B82F6', label: 'Good' },
    3: { emoji: '😐', color: '#F59E0B', label: 'Okay' },
    2: { emoji: '👎', color: '#EF4444', label: 'Poor' },
    1: { emoji: '😢', color: '#7F1D1D', label: 'Very Poor' }
  }

  // Extract unique values from actual feedback data
  const categories = [...new Set(feedback.map(f => f.category).filter(Boolean))]
  const priorities = [...new Set(feedback.map(f => f.priority).filter(Boolean))]

  // Filter feedback by category and priority
  const filteredFeedback = feedback.filter(fb => {
    return (filterCategory === 'all' || fb.category === filterCategory) &&
           (filterPriority === 'all' || fb.priority === filterPriority)
  })

  // Calculate stats from real feedback data
  const stats = {
    totalFeedback: feedback.length,
    averageRating: feedback.length > 0 ? 
      (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : '0.0',
    featuresWithFeedback: new Set(feedback.map(f => f.featureId).filter(Boolean)).size || feedback.length,
    recentFeedback: feedback.filter(f => 
      new Date(f.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const renderFeedbackRating = (rating) => {
    const ratingData = ratingEmojis[rating]
    if (!ratingData) return null
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '20px', lineHeight: 1 }}>
          {ratingData.emoji}
        </span>
        <span style={{ color: ratingData.color, fontWeight: '600' }}>
          {ratingData.label}
        </span>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Developer Dashboard</h1>
        <p className="page-subtitle">Loading feedback data...</p>
        
        <div className="card">
          <div className="text-center">
            <Loader size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Fetching latest feedback...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Developer Dashboard</h1>
        <p className="page-subtitle">Unable to load feedback data</p>
        
        <div className="card">
          <div className="text-center">
            <AlertCircle size={48} style={{ color: '#EF4444', marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem', color: '#EF4444' }}>Error Loading Data</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {error}
            </p>
            <button 
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title">Developer Dashboard</h1>
          <p className="page-subtitle">Track feedback and satisfaction trends for your deliveries</p>
        </div>
        {user && user.role === 'developer' && onCreateFeature && (
          <button 
            className="btn btn-primary"
            onClick={onCreateFeature}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--accent-secondary)'}
            onMouseOut={(e) => e.target.style.background = 'var(--accent-primary)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Feature
          </button>
        )}
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-2">
        <div className="card stats-card">
          <span className="stats-number">{stats.totalFeedback}</span>
          <span className="stats-label">Total Feedback</span>
        </div>
        
        <div className="card stats-card">
          <span className="stats-number">{stats.averageRating}</span>
          <span className="stats-label">Average Rating</span>
        </div>
        
        <div className="card stats-card">
          <span className="stats-number">{stats.featuresWithFeedback}</span>
          <span className="stats-label">Features with Feedback</span>
        </div>
        
        <div className="card stats-card">
          <span className="stats-number">{stats.recentFeedback}</span>
          <span className="stats-label">This Week</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Filter size={20} color="var(--accent-primary)" />
          <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Filter Feedback</h3>
        </div>
        
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select 
              className="form-select"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>
            Recent Feedback ({filteredFeedback.length})
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <TrendingUp size={18} />
            <span>Sorted by newest</span>
          </div>
        </div>
        
        {filteredFeedback.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No feedback found matching your filters</p>
          </div>
        ) : (
          <div>
            {filteredFeedback.map(feedback => (
              <div key={feedback._id} className="feedback-item">
                <div className="feedback-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>{feedback.title}</h4>
                      {renderFeedbackRating(feedback.rating)}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {feedback.isAnonymous ? (
                          <>
                            <UserX size={14} />
                            <span className="anonymous-badge">Anonymous</span>
                          </>
                        ) : (
                          <>
                            <User size={14} />
                            {feedback.userName}
                          </>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        {formatTimeAgo(feedback.createdAt)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          backgroundColor: feedback.priority === 'high' ? '#fee2e2' : feedback.priority === 'medium' ? '#fef3c7' : '#d1fae5',
                          color: feedback.priority === 'high' ? '#991b1b' : feedback.priority === 'medium' ? '#92400e' : '#065f46',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {feedback.priority?.toUpperCase()}
                        </span>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '0.75rem',
                          border: '1px solid var(--border-color)'
                        }}>
                          {feedback.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {feedback.description && (
                  <div className="feedback-comment">
                    "{feedback.description}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeveloperDashboard 