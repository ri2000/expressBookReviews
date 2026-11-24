const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require("axios");


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (isValid(username)){
        if (!users.find((user) => user.username === username)){
            users.push({username:  username, password: password});
            console.log(`Users after push: ${JSON.stringify(users)}`);
            return res.status(200).send(`User - username: ${username} password: ${password} added!`);
        }
        else{
            return res.status(400).send(`User name: ${username} already exists`);
        }
    }
    else{
        return res.status(400).send(`User name: ${username} is not valid`);
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    if (books[req.params.isbn]){
        return res.status(200).send(JSON.stringify(books[req.params.isbn]));
    }
    else{
        return res.status(404).send(`Could not find a book with ISBN: ${req.params.isbn} in the database...`);
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    return res.status(200).send(JSON.stringify(Object.keys(books).filter((key) => {
        return books[key].author === req.params.author
    }).map((key) => books[key])))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    return res.status(200).send(JSON.stringify(Object.keys(books).filter((key) => {
        return books[key].title === req.params.title
    }).map((key) => books[key])))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.status(200).send(JSON.stringify(Object.keys(books).filter((key) => {
        return key === req.params.isbn;
    }).map((key) => books[key].reviews)))
});

async function getAllBooks(){
    try{
        const response = await axios.get("http://localhost:5000/");
        console.log(response);
    }
    except(error){
        console.log(error);
    }
}
getAllBooks();

async function getBookById(id){
    try{
        const response = await axios.get("http://localhost:5000/isbn/${id}");
        console.log(response);
    }
    except(error){
        console.log(error);
    }
}
getBookById(1);

async function getBookByAuthor(author){
    try{
        const encodedAuthor = encodeURIComponent(author);
        const response = await axios.get("http://localhost:5000/${encodedAuthor}");
        console.log(response);
    }
    except(error){
        console.log(error);
    }
}
getBookByAuthor("Unknown");

async function getBookByTitle(title){
    try{
        const encodedTitle = encodeURIComponent(title);
        const response = await axios.get("http://localhost:5000/${encodedTitle}");
        console.log(response);
    }
    except(error){
        console.log(error);
    }
}
getBookByAuthor("The Book Of Job");

module.exports.general = public_users;
