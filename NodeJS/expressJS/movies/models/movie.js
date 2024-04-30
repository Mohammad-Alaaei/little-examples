const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        default: ''
    },
    score: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Movies", movieSchema);