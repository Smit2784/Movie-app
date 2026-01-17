const mongoose = require('mongoose');
const axios = require('axios');
const User = require('../models/User');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';

async function verifyAdminFixes() {
    console.log('🔄 Starting Verification...');

    try {
        // 1. Connect to Database directly to setup test data
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 2. Create a temporary Admin User
        const adminEmail = `testadmin_${Date.now()}@example.com`;
        const adminPass = 'password123';

        // Ensure cleanup first
        await User.findOneAndDelete({ email: adminEmail });

        const adminUser = new User({
            name: 'Test Admin',
            email: adminEmail,
            password: adminPass, // Will be hashed by pre-save hook
            phone: '1234567890',
            role: 'admin' // CRITICAL: This was the key requirement
        });
        await adminUser.save();
        console.log(`✅ Created test admin user: ${adminEmail}`);

        // 3. Login to get Token
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: adminEmail,
            password: adminPass
        });
        const token = loginRes.data.token;
        console.log('✅ Login successful, obtained token');

        // 4. Test 1: Verify authAdmin middleware (Access Protected Route)
        try {
            await axios.get(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Test 1 Passed: Admin middleware allows access to /api/admin/stats');
        } catch (err) {
            console.error('❌ Test 1 Failed: Admin middleware blocked access', err.response?.data || err.message);
        }

        // 5. Test 2: Verify GET /api/theaters (Missing Route Fix)
        try {
            const theatersRes = await axios.get(`${API_URL}/theaters`);
            if (theatersRes.data.success && Array.isArray(theatersRes.data.theater)) {
                console.log('✅ Test 2 Passed: GET /api/theaters returns expected format');
            } else {
                console.error('❌ Test 2 Failed: Unexpected response format', theatersRes.data);
            }
        } catch (err) {
            console.error('❌ Test 2 Failed: Could not fetch theaters', err.message);
        }

        // 6. Test 3: Verify POST /api/admin/theaters (Security Fix)
        const newTheater = {
            name: `Test Theater ${Date.now()}`,
            location: 'Test Location',
            capacity: 100,
            screens: 2,
            facilities: ['AC', 'Test']
        };

        try {
            const createRes = await axios.post(`${API_URL}/admin/theaters`, newTheater, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (createRes.status === 201) {
                console.log('✅ Test 3 Passed: Admin can create theater via /api/admin/theaters');
            }
        } catch (err) {
            console.error('❌ Test 3 Failed: Admin could not create theater', err.response?.data || err.message);
        }

        // Cleanup
        await User.findOneAndDelete({ email: adminEmail });
        console.log('🧹 Cleanup done');

    } catch (error) {
        console.error('❌ Verification Script Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

// Wait for server to potentially start if running locally, or just run
console.log('⏳ Ensure backend server is running on port 5000...');
verifyAdminFixes();
