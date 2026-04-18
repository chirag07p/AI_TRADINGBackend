require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
