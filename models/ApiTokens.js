const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ApiTokensSchema = new mongoose.Schema({
  access_token: {
    type: String,
    default: ''
  },
  owner: {
    type: String,
    default: ''
  },
  scope: {
    type: String,
    default: ''
  },
  uses: {
    type: Number,
    default: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('ApiTokens', ApiTokensSchema);
