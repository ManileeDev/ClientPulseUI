import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Calendar, Target, Award, Loader } from 'lucide-react'
import { feedbackAPI } from '../services/api'

const Analytics = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await feedbackAPI.getAll()
        if (response.success) {
          setFeedback(response.feedback || [])
        } else {
          setError(response.message || 'Failed to load analytics data')
        }
      } catch (err) {
        console.error('Analytics fetch error:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  // Calculate basic metrics
  const calculateMetrics = () => {
    if (feedback.length === 0) {
      return {
        totalFeedback: 0,
        avgRating: 0,
        highRatings: 0,
        lowRatings: 0
      }
    }

    const totalRating = feedback.reduce((sum, f) => sum + (f.rating || 0), 0)
    const avgRating = totalRating / feedback.length
    const highRatings = feedback.filter(f => f.rating >= 4).length
    const lowRatings = feedback.filter(f => f.rating <= 2).length

    return {
      totalFeedback: feedback.length,
      avgRating: avgRating.toFixed(1),
      highRatings,
      lowRatings
    }
  }

  const metrics = calculateMetrics()

  // Calculate rating distribution
  const ratingDistribution = {
    excellent: feedback.filter(f => f.rating === 5).length,
    good: feedback.filter(f => f.rating === 4).length,
    okay: feedback.filter(f => f.rating === 3).length,
    poor: feedback.filter(f => f.rating <= 2).length
  }

  // Loading state
  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Analytics & Insights</h1>
        <p className="page-subtitle">Loading analytics data...</p>
        
        <div className="card">
          <div className="text-center">
            <Loader className="animate-spin" size={32} style={{ color: '#667eea', marginBottom: '1rem' }} />
            <p>Calculating insights from feedback data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Analytics & Insights</h1>
        <p className="page-subtitle">Unable to load analytics</p>
        
        <div className="card">
          <div className="text-center">
            <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
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
      <h1 className="page-title">Analytics & Insights</h1>
      <p className="page-subtitle">Overview of feedback data and user satisfaction metrics</p>
      
      {/* Summary Cards */}
      <div className="grid grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Users size={24} style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }} />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Total Feedback</h3>
          </div>
          <div className="stats-number">{metrics.totalFeedback}</div>
          <div className="stats-label">Feedback submissions</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Award size={24} style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }} />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Average Rating</h3>
          </div>
          <div className="stats-number">{metrics.avgRating}/5</div>
          <div className="stats-label">User satisfaction</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <TrendingUp size={24} style={{ color: '#10B981', marginRight: '0.5rem' }} />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>High Ratings</h3>
          </div>
          <div className="stats-number">{metrics.highRatings}</div>
          <div className="stats-label">4-5 star ratings</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Target size={24} style={{ color: '#F59E0B', marginRight: '0.5rem' }} />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Low Ratings</h3>
          </div>
          <div className="stats-number">{metrics.lowRatings}</div>
          <div className="stats-label">1-2 star ratings</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="card">
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Rating Distribution</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>⭐⭐⭐⭐⭐ Excellent</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '200px', 
                height: '8px', 
                backgroundColor: 'var(--border-color)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${metrics.totalFeedback > 0 ? (ratingDistribution.excellent / metrics.totalFeedback) * 100 : 0}%`, 
                  height: '100%', 
                  backgroundColor: '#10B981' 
                }} />
              </div>
              <span style={{ fontWeight: '600', minWidth: '40px', color: 'var(--text-primary)' }}>
                {ratingDistribution.excellent}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>⭐⭐⭐⭐ Good</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '200px', 
                height: '8px', 
                backgroundColor: 'var(--border-color)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${metrics.totalFeedback > 0 ? (ratingDistribution.good / metrics.totalFeedback) * 100 : 0}%`, 
                  height: '100%', 
                  backgroundColor: '#3B82F6' 
                }} />
              </div>
              <span style={{ fontWeight: '600', minWidth: '40px', color: 'var(--text-primary)' }}>
                {ratingDistribution.good}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>⭐⭐⭐ Okay</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '200px', 
                height: '8px', 
                backgroundColor: 'var(--border-color)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${metrics.totalFeedback > 0 ? (ratingDistribution.okay / metrics.totalFeedback) * 100 : 0}%`, 
                  height: '100%', 
                  backgroundColor: '#F59E0B' 
                }} />
              </div>
              <span style={{ fontWeight: '600', minWidth: '40px', color: 'var(--text-primary)' }}>
                {ratingDistribution.okay}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>⭐⭐ Poor</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '200px', 
                height: '8px', 
                backgroundColor: 'var(--border-color)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${metrics.totalFeedback > 0 ? (ratingDistribution.poor / metrics.totalFeedback) * 100 : 0}%`, 
                  height: '100%', 
                  backgroundColor: '#EF4444' 
                }} />
              </div>
              <span style={{ fontWeight: '600', minWidth: '40px', color: 'var(--text-primary)' }}>
                {ratingDistribution.poor}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Feedback Preview */}
      <div className="card">
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Recent Feedback</h2>
        {feedback.length === 0 ? (
          <div className="text-center">
            <p style={{ color: 'var(--text-secondary)' }}>No feedback data available yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {feedback.slice(0, 5).map((item, index) => (
              <div key={index} style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--input-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{item.title || 'Feedback'}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      backgroundColor: item.rating >= 4 ? '#10B981' : item.rating >= 3 ? '#F59E0B' : '#EF4444',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {item.rating}/5
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {item.description || 'No description provided'}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {item.isAnonymous ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        👤 Anonymous
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        👤 {item.userName}
                      </span>
                    )}
                    {item.category && (
                      <span>Category: {item.category}</span>
                    )}
                    {item.createdAt && (
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Analytics 