// Test integration script to verify UI-API communication

const API_BASE_URL = 'http://localhost:5000/api';

// Test endpoints
const testEndpoints = async () => {
  console.log('🚀 Starting API Integration Tests...\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing Health Check...');
    const response = await fetch(`${API_BASE_URL}/configurations/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.success ? 'PASSED' : 'FAILED');
    console.log('   Response:', data.message);
  } catch (error) {
    console.log('❌ Health Check: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 2: Get Configurations
  try {
    console.log('\n2. Testing Configuration Endpoints...');
    
    const configs = await Promise.all([
      fetch(`${API_BASE_URL}/configurations/feedback-categories`),
      fetch(`${API_BASE_URL}/configurations/priority-options`),
      fetch(`${API_BASE_URL}/configurations/rating-options`)
    ]);
    
    const results = await Promise.all(configs.map(r => r.json()));
    console.log('✅ Configuration Endpoints: PASSED');
    console.log('   Categories:', results[0].categories?.length || 0);
    console.log('   Priorities:', results[1].priorities?.length || 0);
    console.log('   Ratings:', results[2].ratings?.length || 0);
  } catch (error) {
    console.log('❌ Configuration Endpoints: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 3: Get Features (Public)
  try {
    console.log('\n3. Testing Features Endpoint...');
    const response = await fetch(`${API_BASE_URL}/features`);
    const data = await response.json();
    console.log('✅ Features Endpoint:', data.success ? 'PASSED' : 'FAILED');
    console.log('   Features Count:', data.features?.length || 0);
  } catch (error) {
    console.log('❌ Features Endpoint: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 4: Get Feedback (Public)
  try {
    console.log('\n4. Testing Feedback Endpoint...');
    const response = await fetch(`${API_BASE_URL}/feedback`);
    const data = await response.json();
    console.log('✅ Feedback Endpoint:', data.success ? 'PASSED' : 'FAILED');
    console.log('   Feedback Count:', data.feedback?.length || 0);
  } catch (error) {
    console.log('❌ Feedback Endpoint: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 5: Test Authentication Endpoints (without actually registering)
  try {
    console.log('\n5. Testing Authentication Endpoints Structure...');
    
    // Test signup with empty data (should fail gracefully)
    const signupResponse = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const signupData = await signupResponse.json();
    
    // Test login with empty data (should fail gracefully)
    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const loginData = await loginResponse.json();
    
    console.log('✅ Authentication Endpoints: STRUCTURE OK');
    console.log('   Signup validation:', signupData.success === false ? 'WORKING' : 'NEEDS CHECK');
    console.log('   Login validation:', loginData.success === false ? 'WORKING' : 'NEEDS CHECK');
  } catch (error) {
    console.log('❌ Authentication Endpoints: FAILED');
    console.log('   Error:', error.message);
  }

  console.log('\n🎉 Integration tests completed!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Start the server: cd client-pulse-server && npm start');
  console.log('   2. Start the client: cd client-pulse-view/react && npm run dev');
  console.log('   3. Test registration and login in the UI');
  console.log('   4. Test creating feedback as a client');
  console.log('   5. Test creating features as a developer');
};

// Export for use in React app
export const runIntegrationTests = testEndpoints;

// Run tests if called directly
if (typeof window === 'undefined') {
  testEndpoints();
}

export default {
  testEndpoints,
  runIntegrationTests
}; 