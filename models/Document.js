const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema({
    content: {
        type: String
    }
}, { timestamps: true });

module.exports = { DocSchema };