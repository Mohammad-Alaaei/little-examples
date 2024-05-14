const mongoose = require("mongoose");
const path = require('path');

const coverImagePath = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    pageCount: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'authors'
    },
    publishDate: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: String,
        required: true,
        default: ''
    }
});

bookSchema.virtual('coverImageFullPath').get(function () {
    if (this.coverImage != null) {
        return path.join('/', coverImagePath, this.coverImage);
    }
});
bookSchema.virtual('shortPublishDate').get(function () {
    return this.publishDate.toISOString().split('T')[0];
});
bookSchema.virtual('shortCreateAt').get(function () {
    return this.createdAt.toISOString().split('T')[0];
});

// Middleware to automatically populate the author field
bookSchema.pre('find', async function (next) {
    this.populate('author', 'name');
    next();
});

bookSchema.pre('findOne', async function (next) {
    this.populate('author', 'name');
    next();
});

bookSchema.set('toObject', { virtuals: true });
bookSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("books", bookSchema);
module.exports.coverImagePath = coverImagePath;