const fs = require('fs');
const path = require('path');

console.log('Verifying ELITE97 STUDY SYSTEM installation...\n');

// Check backend files
const backendFiles = [
  'backend/server.js',
  'backend/package.json',
  'backend/.env',
  'backend/models/User.js',
  'backend/models/Task.js',
  'backend/models/StudySession.js',
  'backend/models/Schedule.js',
  'backend/models/Assignment.js',
  'backend/models/Exam.js',
  'backend/models/Formula.js',
  'backend/models/WeakTopic.js',
  'backend/controllers/authController.js',
  'backend/controllers/taskController.js',
  'backend/controllers/scheduleController.js',
  'backend/controllers/analyticsController.js',
  'backend/controllers/userController.js',
  'backend/routes/auth.js',
  'backend/routes/tasks.js',
  'backend/routes/schedule.js',
  'backend/routes/analytics.js',
  'backend/routes/user.js',
  'backend/middleware/authMiddleware.js'
];

// Check frontend files
const frontendFiles = [
  'frontend/package.json',
  'frontend/public/index.html',
  'frontend/src/index.js',
  'frontend/src/App.js',
  'frontend/src/index.css',
  'frontend/src/context/AuthContext.js',
  'frontend/src/components/PrivateRoute.js',
  'frontend/src/layouts/Navbar.js',
  'frontend/src/pages/Login.js',
  'frontend/src/pages/Register.js',
  'frontend/src/pages/Dashboard.js',
  'frontend/src/pages/Analytics.js',
  'frontend/src/pages/Tasks.js',
  'frontend/src/pages/Planner.js',
  'frontend/src/pages/Schedule.js',
  'frontend/src/pages/Settings.js',
  'frontend/src/services/api.js'
];

let missingFiles = [];

backendFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    missingFiles.push(`Backend: ${file}`);
  }
});

frontendFiles.forEach(file => {
  if (!fs.existsSync(path.join(__dirname, file))) {
    missingFiles.push(`Frontend: ${file}`);
  }
});

if (missingFiles.length === 0) {
  console.log('✅ All required files are present!');
  console.log('\nFile structure verification: PASSED');
} else {
  console.log('❌ Missing files:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
  console.log(`\nFile structure verification: FAILED (${missingFiles.length} missing files)`);
}

console.log('\nTo run the system:');
console.log('1. Ensure MongoDB is running on localhost:27017');
console.log('2. Start backend: cd backend && npm start');
console.log('3. Start frontend: cd frontend && npm start');
console.log('4. Visit http://localhost:3000 in your browser');