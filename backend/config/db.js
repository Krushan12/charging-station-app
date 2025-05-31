require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority',
    ssl: true,
    authSource: 'admin'
  }
};