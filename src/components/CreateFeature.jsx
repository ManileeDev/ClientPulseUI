import { useState } from 'react';
import { Plus, Save, X, AlertCircle, CheckCircle, Calendar, Tag, Loader, Edit } from 'lucide-react';
import { featureAPI } from '../services/api';

const CreateFeature = ({ user, onFeatureCreated, onFeatureUpdated, onClose, editingFeature = null }) => {
  const [formData, setFormData] = useState({
    name: editingFeature?.name || '',
    description: editingFeature?.description || '',
    category: editingFeature?.category || '',
    priority: editingFeature?.priority || 'medium',
    estimatedHours: editingFeature?.estimatedHours || '',
    targetDate: editingFeature?.targetDate ? editingFeature.targetDate.split('T')[0] : '',
    tags: editingFeature?.tags ? editingFeature.tags.join(', ') : ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hardcoded categories and priorities
  const categories = [
    { value: 'feature', name: 'Feature' },
    { value: 'story', name: 'Story' },
    { value: 'bug', name: 'Bug' },
    { value: 'documentation', name: 'Documentation' }
  ];

  const priorities = [
    { value: 'low', name: 'Low' },
    { value: 'medium', name: 'Medium' },
    { value: 'high', name: 'High' },
    { value: 'critical', name: 'Critical' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.category) {
        setError('Name, description, and category are required');
        setIsSubmitting(false);
        return;
      }

      // Prepare submission data
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
        targetDate: formData.targetDate || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      console.log(editingFeature ? 'Updating feature with data:' : 'Creating feature with data:', submitData);

      const response = editingFeature 
        ? await featureAPI.update(editingFeature._id, submitData)
        : await featureAPI.create(submitData);

      if (response.success) {
        setSuccess(editingFeature ? 'Feature updated successfully!' : 'Feature created successfully!');
        
        // Call the appropriate callback to update parent component
        if (editingFeature && onFeatureUpdated) {
          onFeatureUpdated(response.feature);
        } else if (!editingFeature && onFeatureCreated) {
          onFeatureCreated(response.feature);
        }

        // Reset form
        setFormData({
          name: '',
          description: '',
          category: '',
          priority: 'medium',
          estimatedHours: '',
          targetDate: '',
          tags: ''
        });

        // Close modal after a brief delay
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 2000);
      } else {
        setError(response.message || `Failed to ${editingFeature ? 'update' : 'create'} feature`);
      }
    } catch (err) {
      setError(err.message || `Something went wrong while ${editingFeature ? 'updating' : 'creating'} the feature`);
      console.error(`Feature ${editingFeature ? 'update' : 'creation'} error:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="create-feature-modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            {editingFeature ? <Edit size={24} /> : <Plus size={24} />}
            <h2>{editingFeature ? 'Edit Feature' : 'Create New Feature'}</h2>
          </div>
          {onClose && (
            <button className="close-button" onClick={onClose} type="button">
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="feature-form">
          <div className="form-group">
            <label htmlFor="name">Feature Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter feature name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the feature in detail"
              rows={4}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedHours">Estimated Hours</label>
              <input
                type="number"
                id="estimatedHours"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleInputChange}
                placeholder="e.g., 40"
                min="1"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetDate">Target Date</label>
              <input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas (e.g., ui, mobile, api)"
              disabled={isSubmitting}
            />
            <small className="help-text">Separate multiple tags with commas</small>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <div className="form-actions">
            {onClose && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {editingFeature ? 'Update Feature' : 'Create Feature'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .create-feature-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: var(--card-bg);
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
          margin-bottom: 24px;
        }

        .modal-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-primary);
        }

        .modal-title h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }

        .close-button {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background: var(--border-color);
        }

        .feature-form {
          padding: 0 24px 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
        }

        input, textarea, select {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          background: var(--input-bg);
          color: var(--text-primary);
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        input:disabled, textarea:disabled, select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .help-text {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          color: #16a34a;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-size: 14px;
        }

        .btn-primary {
          background: #0d9488 !important;
          color: white !important;
          font-weight: 600 !important;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0f766e !important;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: var(--border-color);
          color: var(--text-primary);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--text-tertiary);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .modal-content {
            margin: 10px;
            max-height: calc(100vh - 20px);
          }
        }
      `}</style>
    </div>
  );
};

export default CreateFeature; 