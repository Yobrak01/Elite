const dotenv = require('dotenv');
const result = dotenv.config({ path: 'C:\\Users\\USER\\OneDrive\\Desktop\\Elite97\\backend\\.env' });
console.log('Dotenv result:', result);
console.log('Parsed:', result.parsed);
if (result.parsed) {
  console.log('MONGODB_URI:', result.parsed.MONGODB_URI);
}