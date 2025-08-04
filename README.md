# Client Pulse - Frontend

A modern, responsive React application for the Client Pulse feedback management system.

## 📋 **Overview**

Client Pulse Frontend is a feature-rich React application built with Vite that provides an intuitive user interface for feedback management, feature tracking, and analytics. It offers role-based dashboards, real-time updates, and a fully responsive design optimized for all devices.

## 🛠️ **Tech Stack**

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **HTTP Client**: Fetch API
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Authentication**: JWT Token-based
- **Responsive**: Mobile-first design approach

## 🚀 **Features**

### **User Authentication**
- ✅ User registration with email verification
- ✅ OTP-based account activation
- ✅ Secure login/logout
- ✅ Role-based access (Client/Developer views)
- ✅ Profile management with role display

### **Feedback Management**
- ✅ Create detailed feedback with categories
- ✅ Priority selection (Low, Medium, High, Urgent)
- ✅ Star rating system (1-5 stars)
- ✅ View and manage personal feedback
- ✅ Edit and delete feedback
- ✅ Feedback status tracking

### **Feature Management** (Developer Only)
- ✅ Create and manage features
- ✅ Feature categorization (Feature, Story, Bug, Documentation)
- ✅ Priority and status tracking
- ✅ Edit and archive features
- ✅ Feature filtering and search

### **Analytics Dashboard**
- ✅ Feedback statistics and insights
- ✅ Rating distribution charts
- ✅ Recent feedback overview
- ✅ Performance metrics
- ✅ Visual data representation

### **Responsive Design**
- ✅ Mobile-first responsive layout
- ✅ Touch-friendly interactions
- ✅ Optimized for all screen sizes (320px+)
- ✅ Native app-like mobile experience
- ✅ Accessibility features

### **UI/UX Features**
- ✅ Dark/Light theme toggle
- ✅ Toast notifications
- ✅ Loading states and animations
- ✅ Modal dialogs and overlays
- ✅ Smooth transitions and effects

## 📦 **Installation**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

### **Setup**

1. **Navigate to frontend directory**
```bash
cd client-pulse-view/react
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables** (see Configuration section)

5. **Start development server**
```bash
npm run dev
```

6. **Open browser**
```
http://localhost:5173
```

## ⚙️ **Configuration**

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
# For production:
# VITE_API_URL=https://your-backend-domain.com

# App Configuration
VITE_APP_NAME=Client Pulse
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Feedback Management System

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_NOTIFICATIONS=true
```

## 📝 **Available Scripts**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Type check (if using TypeScript)
npm run type-check
```

## 📁 **Project Structure**

```
client-pulse-view/react/
├── public/                 # Static assets
│   ├── vite.svg
│   └── index.html
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── Analytics.jsx
│   │   ├── AuthModal.jsx
│   │   ├── ClientFeedback.jsx
│   │   ├── CreateFeature.jsx
│   │   ├── DeveloperDashboard.jsx
│   │   ├── FeatureList.jsx
│   │   ├── FeatureManagement.jsx
│   │   ├── MyFeedbacks.jsx
│   │   ├── OTPVerification.jsx
│   │   └── ProfileMenu.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── utils/            # Utility functions
│   │   └── testIntegration.js
│   ├── App.jsx           # Main App component
│   ├── App.css           # Global styles
│   ├── main.jsx          # App entry point
│   └── index.css         # Base styles
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── README.md            # This file
```

## 🎨 **Styling & Theming**

### **CSS Architecture**
- **CSS Variables**: Dynamic theming support
- **Mobile-first**: Responsive breakpoints
- **Component-scoped**: Modular styling approach
- **Utility classes**: Helper classes for common patterns

### **Theme System**
```css
/* Light Theme */
:root {
  --bg-gradient: linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #3b82f6 100%);
  --header-bg: rgba(255, 255, 255, 0.95);
  --card-bg: rgba(255, 255, 255, 0.96);
  --text-primary: #1f2937;
  --accent-primary: #0d9488;
}

/* Dark Theme */
[data-theme="dark"] {
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  --header-bg: rgba(15, 23, 42, 0.95);
  --card-bg: rgba(30, 41, 59, 0.96);
  --text-primary: #f8fafc;
  --accent-primary: #14b8a6;
}
```

### **Responsive Breakpoints**
```css
/* Extra small devices */
@media (max-width: 320px) { }

/* Small devices */
@media (max-width: 576px) { }

/* Medium devices */
@media (max-width: 768px) { }

/* Large devices */
@media (min-width: 769px) { }
```

## 🔗 **API Integration**

### **Service Layer**
All API interactions are centralized in `src/services/api.js`:

```javascript
// Authentication APIs
export const authAPI = {
  register: (userData) => { },
  login: (credentials) => { },
  verifyOTP: (email, otp) => { },
  resendOTP: (email) => { }
}

// Feedback APIs
export const feedbackAPI = {
  create: (feedbackData) => { },
  getAll: () => { },
  getByUserId: (userId) => { },
  update: (id, data) => { },
  delete: (id) => { }
}

// Feature APIs
export const featureAPI = {
  create: (featureData) => { },
  getAll: () => { },
  update: (id, data) => { },
  delete: (id) => { }
}
```

### **Authentication Flow**
1. User submits registration → OTP sent to email
2. User verifies OTP → Account created
3. User logs in → JWT token received and stored
4. Token included in all authenticated requests
5. Token validated by backend middleware

### **Error Handling**
- Comprehensive error catching in API calls
- User-friendly error messages
- Toast notifications for feedback
- Retry mechanisms for failed requests

## 🚀 **Deployment**

### **Build for Production**
```bash
# Create production build
npm run build

# Test production build locally
npm run preview
```

### **Static Hosting (Recommended)**

#### **Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configure environment variables in Vercel dashboard
```

#### **Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### **GitHub Pages**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/your-repo-name",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

### **Docker Deployment**

#### **Dockerfile**
```dockerfile
# Build stage
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **nginx.conf**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### **Environment Variables for Production**
```env
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=Client Pulse
VITE_APP_VERSION=1.0.0
```

## 🔧 **Configuration Options**

### **Vite Configuration**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### **ESLint Configuration**
```javascript
// eslint.config.js
export default [
  js.configs.recommended,
  ...react.configs.flat.recommended,
  // Custom rules
]
```

## 📱 **Mobile Responsiveness**

### **Key Features**
- **Touch-first interactions**: 44px minimum touch targets
- **Responsive navigation**: Horizontal scroll with snap points
- **Full-screen modals**: Native app-like mobile experience
- **Optimized forms**: Prevents zoom on iOS devices
- **Gesture support**: Swipe and scroll interactions

### **Breakpoint Strategy**
- **320px+**: Ultra-small phones
- **576px+**: Standard phones
- **768px+**: Tablets
- **1024px+**: Desktop

### **Mobile-Specific Features**
- Collapsible navigation
- Bottom sheet modals
- Touch-friendly buttons
- Optimized typography
- Safe area support for notched devices

## 🧪 **Testing**

### **Component Testing**
```bash
# Run tests (when implemented)
npm run test

# Test coverage
npm run test:coverage
```

### **Manual Testing Checklist**
- [ ] User registration and OTP verification
- [ ] Login/logout functionality
- [ ] Feedback creation and management
- [ ] Feature management (developer role)
- [ ] Theme toggle functionality
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## 🔧 **Troubleshooting**

### **Common Issues**

1. **API Connection Failed**
   - Check backend server is running
   - Verify `VITE_API_URL` in `.env`
   - Check CORS configuration

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for syntax errors
   - Verify all imports are correct

3. **Styling Issues**
   - Clear browser cache
   - Check CSS variable definitions
   - Verify responsive breakpoints

4. **Authentication Not Working**
   - Check localStorage for tokens
   - Verify API endpoints
   - Check network requests in DevTools

### **Development Tips**
- Use React DevTools for debugging
- Check browser console for errors
- Use network tab to monitor API calls
- Test on different screen sizes
- Verify responsive design in DevTools

## 🌟 **Features in Detail**

### **Authentication System**
- JWT token-based authentication
- Automatic token refresh
- Role-based route protection
- Persistent login state

### **Feedback System**
- Rich text descriptions
- Category selection
- Priority levels
- Star ratings
- User-specific feedback tracking

### **Feature Management**
- CRUD operations for features
- Status tracking
- Priority management
- Developer-only access

### **Analytics Dashboard**
- Real-time statistics
- Visual data representation
- Feedback trends
- Performance metrics

## 📄 **License**

This project is licensed under the MIT License.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add responsive design considerations
5. Test across different devices
6. Submit a pull request

## 📞 **Support**

For issues and questions:
- Check the troubleshooting section
- Review component documentation
- Create an issue in the repository
- Test with different browsers and devices

---

**Made with ❤️ and React for an amazing user experience**
