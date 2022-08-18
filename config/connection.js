const mongoose = require('mongoose');
const is_production = process.env.NODE_ENV;

const url = is_production ? 'mongodb+srv://b-alt-del:password12345@cluster0.c5whavk.mongodb.net/?retryWrites=true&w=majority' : 'mongodb://127.0.0.1:27017/social_api'

  mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;