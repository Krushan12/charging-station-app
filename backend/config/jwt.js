require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET,
  expire: process.env.JWT_EXPIRE,
};