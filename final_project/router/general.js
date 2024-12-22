const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (!isValid(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    return res.send(JSON.stringify(book));
  } else {
    return res.status(404).json({message: "Book not found!"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor));
  } else {
    return res.status(404).json({message: "No books found by this author!"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle));
  } else {
    return res.status(404).json({message: "No books found by this title!"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let reviews = books[isbn].reviews;

  if (reviews.length > 0) {
    return res.send(JSON.stringify(reviews));
  } else {
    return res.status(404).json({message: "No reviews found for this book!"});
  }
});

module.exports.general = public_users;
