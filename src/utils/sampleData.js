// Sample data for initial features to demonstrate the system

export const sampleFeatures = [
  {
    _id: 'sample_1',
    name: 'Real-time Notifications',
    description: 'Push notifications for immediate feedback alerts and status updates to keep teams informed in real-time.',
    category: 'ui',
    status: 'in_development',
    priority: 'high',
    version: '2.1.0',
    estimatedHours: 40,
    actualHours: 25,
    startDate: '2024-01-15',
    targetDate: '2024-02-15',
    tags: ['notifications', 'realtime', 'websockets'],
    metrics: {
      userRequests: 15,
      votes: 8,
      complexity: 7
    },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    _id: 'sample_2',
    name: 'Advanced Analytics Dashboard',
    description: 'Comprehensive analytics with charts, graphs, and detailed insights for feedback trends and user satisfaction metrics.',
    category: 'analytics',
    status: 'completed',
    priority: 'medium',
    version: '2.0.5',
    estimatedHours: 60,
    actualHours: 58,
    startDate: '2023-12-01',
    targetDate: '2024-01-10',
    completedDate: '2024-01-08',
    tags: ['analytics', 'charts', 'insights'],
    metrics: {
      userRequests: 22,
      votes: 12,
      complexity: 8
    },
    createdAt: '2023-11-25T09:00:00Z',
    updatedAt: '2024-01-08T16:45:00Z'
  },
  {
    _id: 'sample_3',
    name: 'Mobile App Integration',
    description: 'Native mobile applications for iOS and Android to provide feedback on-the-go with offline support.',
    category: 'integration',
    status: 'planned',
    priority: 'medium',
    version: '3.0.0',
    estimatedHours: 120,
    actualHours: 0,
    targetDate: '2024-06-01',
    tags: ['mobile', 'ios', 'android', 'offline'],
    metrics: {
      userRequests: 35,
      votes: 18,
      complexity: 9
    },
    createdAt: '2024-01-22T11:30:00Z',
    updatedAt: '2024-01-22T11:30:00Z'
  },
  {
    _id: 'sample_4',
    name: 'AI-Powered Feedback Classification',
    description: 'Automatically categorize and prioritize feedback using machine learning to improve response times.',
    category: 'backend',
    status: 'testing',
    priority: 'high',
    version: '2.2.0',
    estimatedHours: 80,
    actualHours: 75,
    startDate: '2024-01-05',
    targetDate: '2024-02-28',
    tags: ['ai', 'machine-learning', 'automation'],
    metrics: {
      userRequests: 8,
      votes: 5,
      complexity: 10
    },
    createdAt: '2024-01-02T08:15:00Z',
    updatedAt: '2024-01-25T13:20:00Z'
  },
  {
    _id: 'sample_5',
    name: 'Enhanced Security Framework',
    description: 'Implementation of OAuth 2.0, two-factor authentication, and advanced encryption for user data protection.',
    category: 'security',
    status: 'in_development',
    priority: 'critical',
    version: '2.1.5',
    estimatedHours: 45,
    actualHours: 30,
    startDate: '2024-01-20',
    targetDate: '2024-02-10',
    tags: ['security', 'oauth', '2fa', 'encryption'],
    metrics: {
      userRequests: 12,
      votes: 9,
      complexity: 8
    },
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-26T10:15:00Z'
  }
];

export const sampleFeedback = [
  {
    _id: 'feedback_1',
    title: 'Dashboard Loading Performance',
    description: 'The main dashboard takes too long to load, especially when there are many feedback items. Could we optimize this?',
    category: 'performance',
    priority: 'high',
    rating: 3,
    status: 'in_progress',
    userId: 'user_1',
    userEmail: 'john.doe@example.com',
    userName: 'John Doe',
    tags: ['performance', 'dashboard'],
    createdAt: '2024-01-25T09:30:00Z',
    updatedAt: '2024-01-26T14:20:00Z'
  },
  {
    _id: 'feedback_2',
    title: 'Love the New UI Design!',
    description: 'The recent UI updates are fantastic. The interface is much more intuitive and visually appealing. Great work!',
    category: 'ui',
    priority: 'low',
    rating: 5,
    status: 'resolved',
    userId: 'user_2',
    userEmail: 'jane.smith@example.com',
    userName: 'Jane Smith',
    tags: ['ui', 'design', 'positive'],
    createdAt: '2024-01-24T16:45:00Z',
    updatedAt: '2024-01-25T11:10:00Z'
  },
  {
    _id: 'feedback_3',
    title: 'Bug in Feedback Submission',
    description: 'When submitting feedback with special characters in the title, the form throws an error. Please fix this validation issue.',
    category: 'bug',
    priority: 'medium',
    rating: 2,
    status: 'pending',
    userId: 'user_3',
    userEmail: 'mike.wilson@example.com',
    userName: 'Mike Wilson',
    tags: ['bug', 'validation', 'form'],
    createdAt: '2024-01-26T11:20:00Z',
    updatedAt: '2024-01-26T11:20:00Z'
  }
];

export default {
  sampleFeatures,
  sampleFeedback
}; 