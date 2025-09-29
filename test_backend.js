// Test backend authentication
const API_BASE = 'https://portfolio-j9s6.onrender.com'

async function testBackend() {
  console.log('🧪 Testing backend authentication...')
  
  try {
    // Test 1: Check if backend is responding
    console.log('\n1. Testing backend health...')
    const healthResponse = await fetch(`${API_BASE}/health`)
    console.log('Health status:', healthResponse.status)
    
    // Test 2: Try login
    console.log('\n2. Testing login...')
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin123@gmail.com',
        password: 'admin123'
      })
    })
    
    console.log('Login status:', loginResponse.status)
    const loginData = await loginResponse.json()
    console.log('Login response:', loginData)
    
    // Test 3: Check /me endpoint with token
    console.log('\n3. Testing /me endpoint with token...')
    const meResponse = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      }
    })
    
    console.log('Me status:', meResponse.status)
    const meData = await meResponse.json()
    console.log('Me response:', meData)
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testBackend()
