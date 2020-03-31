const mongoose = require('mongoose');

const { UserSchema } = require('./User');
const { DocSchema } = require('./Document');

mongoose.model('User', UserSchema);
mongoose.model('Document', DocSchema);

module.exports = mongoose;