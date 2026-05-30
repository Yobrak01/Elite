const dotenv = require('dotenv');
const result = dotenv.config({ path: './.env' });
console.log('Dotenv result:', result);
console.log('Parsed:', result.parsed);