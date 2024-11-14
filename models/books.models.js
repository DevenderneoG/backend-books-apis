const mongoose = require("mongoose");

const BooksSchema = new mongoose.Schema({
    title: {
        type: String
    },
    author: {
        type: String
    },
    publishedYear: {
        type: Number
    },
    genre: [{
        type: String,
        enum: ["Fiction", "Historical", "Romance", "Fantasy", "Mystery", "Thriller", "Non-Fiction", "Non-fiction", "Self-help", "Business", "Autobiography"]  
    }],
    language: {
        type: String
    },
    country: {
        type: String
    },
    rating: {
        type: Number
    },
    summary: {
        type: String
    },
    coverImageUrl: {
        type: String
    }
});

const Books = mongoose.model("Books", BooksSchema);

module.exports = Books;

