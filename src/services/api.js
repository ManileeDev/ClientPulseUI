const API_BASE_URL = 'http://localhost:5000/api';

  // Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    } catch (error) {
      console.error('Error parsing user token:', error);
    }
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register new user (sends OTP)
  register: async (userData) => {
    console.log('Frontend: Attempting registration with:', userData);
    try {
      const response = await apiRequest('/signup', {
        method: 'POST',
        body: userData,
      });
      console.log('Frontend: Registration response:', response);
      return response;
    } catch (error) {
      console.error('Frontend: Registration error:', error);
      throw error;
    }
  },

  // Verify OTP and complete registration
  verifyOTP: async (email, otp) => {
    console.log('Frontend: Attempting OTP verification for:', email);
    try {
      const response = await apiRequest('/validate-otp', {
        method: 'POST',
        body: { email, otp },
      });
      console.log('Frontend: OTP verification response:', response);
      return response;
    } catch (error) {
      console.error('Frontend: OTP verification error:', error);
      throw error;
    }
  },

  // Resend OTP
  resendOTP: async (email) => {
    console.log('Frontend: Resending OTP for:', email);
    try {
      const response = await apiRequest('/generate-otp', {
        method: 'POST',
        body: { email },
      });
      console.log('Frontend: Resend OTP response:', response);
      return response;
    } catch (error) {
      console.error('Frontend: Resend OTP error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    console.log('Frontend: Attempting login with:', { email: credentials.email, password: '***' });
    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: credentials,
      });
      console.log('Frontend: Login response:', response);
      return response;
    } catch (error) {
      console.error('Frontend: Login error:', error);
      throw error;
    }
  },
};

// Feedback API
export const feedbackAPI = {
  // Create new feedback
  create: async (feedbackData) => {
    return apiRequest('/feedback', {
      method: 'POST',
      body: feedbackData,
    });
  },

  // Get all feedback
  getAll: async () => {
    return apiRequest('/feedback');
  },

  // Get feedback by user ID
  getByUserId: async (userId) => {
    console.log('API: Fetching feedback for user ID:', userId);
    const response = await apiRequest(`/feedback/user/${userId}`);
    console.log('API: User feedback response:', response);
    return response;
  },

  // Get feedback by ID
  getById: async (id) => {
    return apiRequest(`/feedback/${id}`);
  },

  // Update feedback
  update: async (id, feedbackData) => {
    return apiRequest(`/feedback/${id}`, {
      method: 'PUT',
      body: feedbackData,
    });
  },

  // Update feedback status
  updateStatus: async (id, status) => {
    return apiRequest(`/feedback/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
  },

  // Delete feedback
  delete: async (id) => {
    return apiRequest(`/feedback/${id}`, {
      method: 'DELETE',
    });
  },
};

// Feature API
export const featureAPI = {
  // Get all features
  getAll: async () => {
    return apiRequest('/features');
  },

  // Get feature by ID
  getById: async (id) => {
    return apiRequest(`/features/${id}`);
  },

  // Get features by category
  getByCategory: async (category) => {
    return apiRequest(`/features/category/${category}`);
  },

  // Create new feature
  create: async (featureData) => {
    return apiRequest('/features', {
      method: 'POST',
      body: featureData,
    });
  },

  // Update feature
  update: async (id, featureData) => {
    return apiRequest(`/features/${id}`, {
      method: 'PUT',
      body: featureData,
    });
  },
};

// Configuration API
export const configAPI = {
  // Get all configurations
  getAll: async () => {
    return apiRequest('/configurations');
  },

  // Get feedback categories
  getFeedbackCategories: async () => {
    return apiRequest('/configurations/feedback-categories');
  },

  // Get feature categories
  getFeatureCategories: async () => {
    return apiRequest('/configurations/feature-categories');
  },

  // Get priority options
  getPriorityOptions: async () => {
    return apiRequest('/configurations/priority-options');
  },

  // Get rating options
  getRatingOptions: async () => {
    return apiRequest('/configurations/rating-options');
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
}; 