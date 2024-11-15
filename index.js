const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200.
}
app.use(cors(corsOptions));


const { initializeDatabase } = require("./db/db.connect");
const Books = require("./models/books.models")

app.use(express.json());

initializeDatabase();


async function createBook(newBook) {
  try {
    const book = new Books(newBook);
    const savedBook = await book.save();
    console.log("New book data", savedBook);
    return savedBook;
  } catch (error) {
    throw error
  }
}

app.post("/books", async (req, res) => {

  const { title, author, publishedYear, genre, language, country, rating, summary, coverImageUrl } = req.body;

  if (!title || !author || !publishedYear || !genre || !language || !country || !rating || !summary || !coverImageUrl) {
    return res.status(400).json({ error: "Missing required fields: title, author, or publishedDate" });
  }

  try {
    const saveBook = await createBook(req.body);
    res.status(201).json({ message: "Book added successfully.", book: saveBook })
  } catch (error) {
    res.status(500).json({ error: "Failed to add book.", details: error.message });
  }
})

async function readAllBooks() {
  try {
    const allBooks = await Books.find();
    return allBooks;
  } catch (error) {
    console.log(error)
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();
    if (books.length != 0) {
      res.json(books)
    } else {
      res.status(404).json({ error: "No books found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." })
  }
})


async function readBooksByTitle(bookTitle) {
  try {
    const book = await Books.findOne({ title: bookTitle })
    return book;
  } catch (error) {
    throw error
  }
}

app.get("/books/:title", async (req, res) => {

  try {
    const bookByTitle = await readBooksByTitle(req.params.title);
    if (bookByTitle) {
      res.json(bookByTitle)
    } else {
      res.status(200).json({ error: 'Book not found.' })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Book." })
  }
})

async function readBooksByAuthor(bookAuthor) {
  try {
    const book = await Books.findOne({ author: bookAuthor })
    return book;
  } catch (error) {
    throw error;
  }
}


app.get("/books/author/:authorName", async (req, res) => {

  try {
    const bookByAuthor = await readBooksByAuthor(req.params.authorName);
    if (bookByAuthor) {
      res.json(bookByAuthor)
    } else {
      res.status(200).json({ error: 'Book not found.' })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Book." })
  }
})

async function readBooksByGenre(bookGenre) {
  try {
    const book = await Books.findOne({ genre: bookGenre });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/genre/:genreName", async (req, res) => {

  try {
    const bookByGenre = await readBooksByGenre(req.params.genreName);
    if (bookByGenre) {
      res.json(bookByGenre)
    } else {
      res.status(200).json({ error: 'Book not found.' })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Book." })
  }
})


async function readBooksByDate(bookPublishedYear) {
  try {
    const book = await Books.findOne({ publishedYear: bookPublishedYear });
    return book;
  } catch (error) {
    throw error;
  }
}

app.get("/books/publishedyear/:year", async (req, res) => {

  try {
    const bookByPublishedYear = await readBooksByDate(req.params.year);
    if (bookByPublishedYear) {
      res.json(bookByPublishedYear)
    } else {
      res.status(200).json({ error: 'Book not found' })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Book." })
  }
})


async function updateBooksRating(bookId, dataToUpdateRating) {
  try {
    const updateBookByRating = await Books.findByIdAndUpdate(bookId, dataToUpdateRating, { new: true });
    return updateBookByRating
  } catch (error) {
    console.log("Error in updating Books data", error);
  }
}


app.post("/books/:bookId", async (req, res) => {

  try {
    const updateBookById = await updateBooksRating(req.params.bookId, req.body);
    if(updateBookById) {
      res.status(200).json({message: "Books updated successfully.", updateBookById: updateBookById})
    }
    else {
      res.status(404).json({error: "Book does not exist."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to update Book."})
  }
  
})


async function updateBookByTitle(bookTitle, dataToUpdateRating) {
  try {
    const updatedBookByTitle = await Books.findOneAndUpdate({title: bookTitle}, {$set: dataToUpdateRating}, {new: true})         
  //  console.log(updatedBookByTitle);
  return updatedBookByTitle;
  } catch (error) {
    console.log("Error in updating Book data", error);
  }
}

// updateBookByTitle("Shoe Dog",  { "publishedYear": 2017, "rating": 4.2 })

app.post("/books/booktitle/:title", async (req, res) => {
  try {
    const updateBookDataByTitle = await updateBookByTitle(req.params.title, req.body);
    if(updateBookDataByTitle) {
      res.status(200).json({message: "Books updated successfully.", updateBookDataByTitle: updateBookDataByTitle})
    } else {
      res.status(404).json({error: "Book does not exist"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to update Book."})
  }
})

async function deleteBook(bookId) {
  try {
    const deletedBook = await Books.findByIdAndDelete(bookId);
    return deletedBook;
  } catch (error) {
    console.log("Error in deleting book:", error); 
    throw new Error("Failed to delete book"); 
  }
}


app.delete("/books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId; 
    const deletedBook = await deleteBook(bookId);

    if (deletedBook) {
      res.status(200).json({
        message: "Book deleted successfully.",
        deletedBook: deletedBook,  
      });
    } else {      
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {   
    console.error("Error in delete route:", error);  
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)})



