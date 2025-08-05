import { useState, useEffect } from 'react';
import { Plus, Settings, Calendar, User, Tag, Filter, Edit, Trash2, Archive, Loader, AlertCircle } from 'lucide-react';
import { featureAPI } from '../services/api';
import CreateFeature from './CreateFeature';

const FeatureManagement = ({ user }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateFeature, setShowCreateFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Fetch features
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const response = await featureAPI.getAll();
        
        if (response.success) {
          setFeatures(response.features);
        } else {
          setError('Failed to load features');
        }
      } catch (err) {
        setError('Failed to load features');
        console.error('Features fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const handleFeatureCreated = (newFeature) => {
    setFeatures([newFeature, ...features]);
    setShowCreateFeature(false);
  };

  const handleFeatureUpdated = (updatedFeature) => {
    setFeatures(features.map(f => f._id === updatedFeature._id ? updatedFeature : f));
    setEditingFeature(null);
  };

  const handleEdit = (feature) => {
    setEditingFeature(feature);
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: '#6B7280',
      in_development: '#F59E0B',
      testing: '#8B5CF6',
      completed: '#10B981',
      cancelled: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626'
    };
    return colors[priority] || '#6B7280';
  };

  const getCategoryColor = (category) => {
    const colors = {
      feature: '#3B82F6',
      story: '#8B5CF6',
      bug: '#EF4444',
      documentation: '#059669'
    };
    return colors[category] || '#6B7280';
  };

  // Extract unique values for filtering
  const categories = ['all', ...new Set(features.map(f => f.category).filter(Boolean))];
  const priorities = ['all', ...new Set(features.map(f => f.priority).filter(Boolean))];

  // Filter features
  const filteredFeatures = features.filter(feature => {
    return (filterCategory === 'all' || feature.category === filterCategory) &&
           (filterPriority === 'all' || feature.priority === filterPriority);
  });

  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Feature Management</h1>
        <div className="card">
          <div className="text-center">
            <Loader className="animate-spin" size={32} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading features...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Feature Management</h1>
        <div className="card">
          <div className="text-center">
            <AlertCircle size={48} style={{ color: '#EF4444', marginBottom: '1rem' }} />
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
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Feature Management</h1>
          <p className="page-subtitle">Manage and track feature development ({filteredFeatures.length} features)</p>
        </div>
        {user && user.role === 'developer' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateFeature(true)}
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
          >
            <Plus size={16} />
            Create Feature
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Filter size={20} color="#667eea" />
          <h3 style={{ color: 'var(--text-primary)', margin: 0 }}>Filter Features</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
            >
                             {categories.map(category => (
                 <option key={category} value={category}>
                   {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                 </option>
               ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)'
              }}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.replace('_', ' ').charAt(0).toUpperCase() + priority.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Features List */}
      {filteredFeatures.length === 0 ? (
        <div className="card text-center">
          <Settings size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No Features Found</h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            {features.length === 0 
              ? "No features have been created yet. Start by creating your first feature!" 
              : "No features match the current filters. Try adjusting your search criteria."
            }
          </p>
          {user && user.role === 'developer' && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateFeature(true)}
            >
              <Plus size={16} />
              Create First Feature
            </button>
          )}
        </div>
      ) : (
        <div className="features-grid">
          {filteredFeatures.map(feature => (
            <div key={feature._id} className="feature-card">
              <div className="feature-header">
                <h3 className="feature-title">{feature.name}</h3>
                                                 {user && user.role === 'developer' && (
                  <div className="feature-actions">
                    <button 
                      className="action-btn" 
                      title="Edit"
                      onClick={() => handleEdit(feature)}
                    >
                      <Edit size={16} />
                    </button>
                    <button className="action-btn" title="Archive">
                      <Archive size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="feature-description">{feature.description}</p>
              
              <div className="feature-meta">
                                 <div className="meta-row">
                   <span className="meta-label">Category:</span>
                   <span 
                     className="category-badge"
                     style={{ 
                       backgroundColor: getCategoryColor(feature.category) + '20',
                       color: getCategoryColor(feature.category),
                       border: `1px solid ${getCategoryColor(feature.category)}40`
                     }}
                   >
                     {feature.category || 'Feature'}
                   </span>
                 </div>
                
                <div className="meta-row">
                  <span className="meta-label">Status:</span>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(feature.status) + '20',
                      color: getStatusColor(feature.status),
                      border: `1px solid ${getStatusColor(feature.status)}40`
                    }}
                  >
                    {feature.status?.replace('_', ' ') || 'Unknown'}
                  </span>
                </div>
                
                <div className="meta-row">
                  <span className="meta-label">Priority:</span>
                  <span 
                    className="priority-badge"
                    style={{ 
                      backgroundColor: getPriorityColor(feature.priority) + '20',
                      color: getPriorityColor(feature.priority),
                      border: `1px solid ${getPriorityColor(feature.priority)}40`
                    }}
                  >
                    {feature.priority || 'Medium'}
                  </span>
                </div>
                
                {feature.estimatedHours && (
                  <div className="meta-row">
                    <span className="meta-label">Estimated:</span>
                    <span>{feature.estimatedHours}h</span>
                  </div>
                )}
                
                {feature.targetDate && (
                  <div className="meta-row">
                    <Calendar size={14} />
                    <span>{new Date(feature.targetDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {feature.tags && feature.tags.length > 0 && (
                  <div className="feature-tags">
                    {feature.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Feature Modal */}
      {user && user.role === 'developer' && (showCreateFeature || editingFeature) && (
        <CreateFeature
          user={user}
          editingFeature={editingFeature}
          onFeatureCreated={handleFeatureCreated}
          onFeatureUpdated={handleFeatureUpdated}
          onClose={() => {
            setShowCreateFeature(false);
            setEditingFeature(null);
          }}
        />
      )}

      <style jsx>{`
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.2s;
        }

        .feature-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .feature-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }

        .feature-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          color: var(--text-tertiary);
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: var(--border-color);
          color: var(--text-primary);
        }

        .feature-description {
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .feature-meta {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .meta-label {
          font-weight: 600;
          color: var(--text-tertiary);
          min-width: 70px;
        }

        .category-badge, .status-badge, .priority-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

                 .category-badge {
           padding: 0.25rem 0.75rem;
           border-radius: 12px;
           font-size: 0.75rem;
           font-weight: 600;
           text-transform: capitalize;
         }

        .feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: var(--border-color);
          color: var(--text-secondary);
          border-radius: 8px;
          font-size: 0.75rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureManagement; 