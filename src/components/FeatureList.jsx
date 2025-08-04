import { useState, useEffect } from 'react'
import { Calendar, Users, GitBranch, Star, MessageSquare, Loader, ExternalLink } from 'lucide-react'
import { featureAPI } from '../services/api'

const FeatureList = () => {
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await featureAPI.getAll()
        if (response.success) {
          setFeatures(response.features)
        }
      } catch (err) {
        setError('Failed to load features')
        console.error('Features fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  // Extract unique values for filtering
  const categories = ['all', ...new Set(features.map(f => f.category).filter(Boolean))]
  const priorities = ['all', ...new Set(features.map(f => f.priority).filter(Boolean))]

  // Filter features
  const filteredFeatures = features.filter(feature => {
    return (filterCategory === 'all' || feature.category === filterCategory) &&
           (filterPriority === 'all' || feature.priority === filterPriority)
  })

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="#F59E0B" color="#F59E0B" style={{ opacity: 0.5 }} />)
    }
    
    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#E5E7EB" />)
    }
    
    return stars
  }

  const getStatusColor = (status) => {
    const colors = {
      live: '#10B981',
      testing: '#F59E0B',
      development: '#3B82F6',
      planning: '#6B7280',
      deprecated: '#EF4444'
    }
    return colors[status] || '#6B7280'
  }

  const formatCategory = (category) => {
    return category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'
  }

  const handleGiveFeedback = () => {
    // Simply navigate to feedback page
    window.location.href = '/'
  }

  // Show loading state
  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Features</h1>
        <p className="page-subtitle">Loading available features...</p>
        
        <div className="card">
          <div className="text-center">
            <Loader className="animate-spin" size={32} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading features...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Features</h1>
        <div className="card">
          <div className="text-center">
            <GitBranch size={48} style={{ color: '#EF4444', marginBottom: '1rem' }} />
            <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error}</p>
            <button 
              className="btn btn-secondary"
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
      <h1 className="page-title">Features</h1>
      <p className="page-subtitle">
        Explore our delivered features and share your feedback
      </p>

      {/* Filters */}
      <div className="card">
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Filter Features
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>
              Category
            </label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid var(--border-color)', 
                borderRadius: '6px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : formatCategory(category)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>
              Priority
            </label>
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid var(--border-color)', 
                borderRadius: '6px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Features ({filteredFeatures.length})
        </h2>
        
        {filteredFeatures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <GitBranch size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No features found matching your filters</p>
          </div>
        ) : (
          <div className="features-list">
            {filteredFeatures.map(feature => (
              <div key={feature._id} className="feature-item">
                <div className="feature-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3>{feature.name}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(feature.status) }}
                    >
                      {feature.status}
                    </span>
                  </div>
                  
                  <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {feature.assignedDeveloper && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={14} />
                        {feature.assignedDeveloper}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <GitBranch size={14} />
                      {formatCategory(feature.category)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      {feature.priority}
                    </div>
                    {(feature.actualDeliveryDate || feature.deliveryDate) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        {new Date(feature.actualDeliveryDate || feature.deliveryDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="feature-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {renderStars(feature.avgRating || 0)}
                      <span style={{ marginLeft: '0.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {feature.avgRating ? feature.avgRating.toFixed(1) : '0.0'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    <MessageSquare size={14} />
                    {feature.feedbackCount || 0} feedback{(feature.feedbackCount || 0) !== 1 ? 's' : ''}
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.5rem 1rem', 
                      width: '100%',
                      backgroundColor: '#0d9488',
                      color: 'white',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '6px'
                    }}
                    onClick={handleGiveFeedback}
                  >
                    <ExternalLink size={16} />
                    Give Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .features-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .feature-item {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
          background: var(--card-bg);
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }

        .feature-item:hover {
          border-color: var(--accent-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .feature-info {
          flex: 1;
          margin-bottom: 1rem;
        }

        .feature-info h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.1rem;
        }

        .feature-meta {
          display: flex;
          flex-direction: column;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
          text-transform: capitalize;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-primary {
          background: #0d9488 !important;
          color: white !important;
          font-weight: 600 !important;
        }

        .btn-primary:hover {
          background: #0f766e !important;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
          background: var(--hover-bg);
        }

        @media (max-width: 768px) {
          .features-list {
            grid-template-columns: 1fr;
          }
          
          .feature-item {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
export default FeatureList 
