const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema({
    content: {
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

module.exports = { DocSchema };