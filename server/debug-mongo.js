require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing connection with URI:', process.env.DB_URI.replace(/:([^:@]{1,})@/, ':****@')); // Hide password in log

mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: Could not connect to MongoDB.');
    console.error('Error Details:', err.message);
    if (err.message.includes('auth')) {
      console.log('\nTIP: This is definitely a username/password issue.');
      console.log('1. Go to Atlas -> Database Access.');
      console.log('2. Reset password for "pradhanchirag03_db" to something simple (e.g., chirag123).');
      console.log('3. Update your .env and try again.');
    }
    process.exit(1);
  });
