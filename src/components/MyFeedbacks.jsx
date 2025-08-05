import { useState, useEffect } from 'react'
import { Edit, Trash2, Calendar, Star, MessageSquare, Tag, AlertCircle, Loader, CheckCircle, X } from 'lucide-react'
import { feedbackAPI, configAPI } from '../services/api'

const MyFeedbacks = ({ user, onOpenAuth }) => {
  const [feedbacks, setFeedbacks] = useState([])
  const [categories, setCategories] = useState([])
  const [priorities, setPriorities] = useState([])
  const [ratingOptions, setRatingOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingFeedback, setEditingFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log('Fetching data for user:', user);
        console.log('User ID:', user._id);
        
        const [feedbackRes, categoriesRes, prioritiesRes, ratingsRes] = await Promise.all([
          feedbackAPI.getByUserId(user._id),
          configAPI.getFeedbackCategories(),
          configAPI.getPriorityOptions(),
          configAPI.getRatingOptions()
        ])
        
        console.log('Feedback response:', feedbackRes);

        if (feedbackRes.success) {
          setFeedbacks(feedbackRes.feedback)
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories.map(cat => ({
            value: cat.value,
            label: cat.name,
            description: cat.description
          })))
        }

        if (prioritiesRes.success) {
          setPriorities(prioritiesRes.priorities.map(pri => ({
            value: pri.value,
            label: pri.name,
            color: pri.metadata?.color
          })))
        }

        if (ratingsRes.success) {
          setRatingOptions(ratingsRes.ratings.map(rating => ({
            value: rating.value,
            label: rating.name,
            color: rating.metadata?.color
          })))
        }

      } catch (err) {
        setError('Failed to load your feedback')
        console.error('My feedbacks fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleEdit = (feedback) => {
    setEditingFeedback({
      ...feedback
    })
  }

  const handleCancelEdit = () => {
    setEditingFeedback(null)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingFeedback) return

    setIsSubmitting(true)
    try {
      const updateData = {
        description: editingFeedback.description,
        category: editingFeedback.category,
        priority: editingFeedback.priority,
        rating: editingFeedback.rating
      }

      const response = await feedbackAPI.update(editingFeedback._id, updateData)
      
      if (response.success) {
        // Update the feedback in the list
        setFeedbacks(feedbacks.map(fb => 
          fb._id === editingFeedback._id 
            ? { ...fb, ...updateData }
            : fb
        ))
        setEditingFeedback(null)
      }
    } catch (err) {
      setError('Failed to update feedback')
      console.error('Update feedback error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (feedbackId) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return

    try {
      const response = await feedbackAPI.delete(feedbackId)
      if (response.success) {
        setFeedbacks(feedbacks.filter(fb => fb._id !== feedbackId))
      }
    } catch (err) {
      setError('Failed to delete feedback')
      console.error('Delete feedback error:', err)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= rating ? "#F59E0B" : "none"}
          color={i <= rating ? "#F59E0B" : "#E5E7EB"}
        />
      )
    }
    return stars
  }

  const getPriorityColor = (priority) => {
    const pri = priorities.find(p => p.value === priority)
    return pri?.color || '#6B7280'
  }

  if (!user) {
    return (
      <div className="fade-in">
        <h1 className="page-title">My Feedbacks</h1>
        <div className="card text-center">
          <AlertCircle size={48} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
          <h3>Please Sign In</h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            You need to sign in to view your feedback submissions.
          </p>
          <button 
            className="btn btn-primary"
            onClick={onOpenAuth}
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title">My Feedbacks</h1>
        <p className="page-subtitle">Loading your feedback...</p>
        
        <div className="card">
          <div className="text-center">
            <Loader className="animate-spin" size={32} style={{ color: 'var(--accent-color)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading your submitted feedback...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fade-in">
        <h1 className="page-title">My Feedbacks</h1>
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
    )
  }

  return (
    <div className="fade-in">
      <h1 className="page-title">My Feedbacks</h1>
      <p className="page-subtitle">
        Manage your submitted feedback ({feedbacks.length})
      </p>

      {feedbacks.length === 0 ? (
        <div className="card text-center">
          <MessageSquare size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No Feedback Yet</h3>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            You haven't submitted any feedback yet. Start by giving feedback on features!
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.href = '/'}
          >
            Give Feedback
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="feedbacks-list">
            {feedbacks.map(feedback => (
              <div key={feedback._id} className="feedback-item">
                {editingFeedback?._id === feedback._id ? (
                  // Edit Form
                  <form onSubmit={handleSaveEdit} className="edit-form">
                    <div className="form-group">
                      <label>Feature</label>
                      <input
                        type="text"
                        value={editingFeedback.featureName || editingFeedback.title}
                        disabled
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          color: 'var(--text-secondary)',
                          cursor: 'not-allowed',
                          opacity: 0.7
                        }}
                      />
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        Feature cannot be changed after feedback is submitted
                      </p>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={editingFeedback.description}
                        onChange={(e) => setEditingFeedback({
                          ...editingFeedback,
                          description: e.target.value
                        })}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={editingFeedback.category}
                          onChange={(e) => setEditingFeedback({
                            ...editingFeedback,
                            category: e.target.value
                          })}
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Priority</label>
                        <select
                          value={editingFeedback.priority}
                          onChange={(e) => setEditingFeedback({
                            ...editingFeedback,
                            priority: e.target.value
                          })}
                        >
                          {priorities.map(pri => (
                            <option key={pri.value} value={pri.value}>
                              {pri.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Rating</label>
                        <select
                          value={editingFeedback.rating}
                          onChange={(e) => setEditingFeedback({
                            ...editingFeedback,
                            rating: parseInt(e.target.value)
                          })}
                        >
                          {ratingOptions.map(rating => (
                            <option key={rating.value} value={rating.value}>
                              {rating.value} - {rating.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  // Display View
                  <div className="feedback-content">
                    <div className="feedback-header">
                      <h3>{feedback.featureName || feedback.title}</h3>
                      <div className="feedback-meta">
                        <span className="badge" style={{ backgroundColor: getPriorityColor(feedback.priority) }}>
                          {feedback.priority}
                        </span>
                        <span className="status-badge">
                          {feedback.status}
                        </span>
                      </div>
                    </div>

                    <p className="feedback-description">{feedback.description}</p>

                    <div className="feedback-details">
                      <div className="detail-item">
                        <Tag size={14} />
                        <span>{feedback.category?.replace('_', ' ')}</span>
                      </div>
                      <div className="detail-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      <div className="detail-item">
                        <Calendar size={14} />
                        <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="feedback-actions">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEdit(feedback)}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(feedback._id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .feedbacks-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feedback-item {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
          background: var(--card-bg);
        }

        .feedback-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feedback-header {
          display: flex;
          justify-content: between;
          align-items: flex-start;
          gap: 1rem;
        }

        .feedback-header h3 {
          margin: 0;
          color: var(--text-primary);
          flex: 1;
        }

        .feedback-meta {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .feedback-description {
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .feedback-details {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .feedback-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--input-bg);
          color: var(--text-primary);
          font-size: 0.875rem;
          width: 100%;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
          text-transform: capitalize;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          background: var(--accent-color);
          color: white;
          text-transform: capitalize;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .btn-danger {
          background: #EF4444;
          color: white;
          border: 1px solid #EF4444;
        }

        .btn-danger:hover {
          background: #DC2626;
          border-color: #DC2626;
        }

        @media (max-width: 768px) {
          .feedback-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .feedback-details {
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-actions {
            flex-direction: column;
            gap: 0.75rem;
          }

          .form-actions .btn {
            width: 100%;
            justify-content: center;
          }

          .feedback-item {
            padding: 1rem;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            font-size: 16px; /* Prevents zoom on iOS */
            padding: 0.875rem;
          }
        }

        @media (max-width: 640px) {
          .form-grid {
            gap: 0.75rem;
          }

          .feedback-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .feedback-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default MyFeedbacks 