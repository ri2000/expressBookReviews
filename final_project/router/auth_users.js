const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return true;
}

const authenticatedUser = (username, password)=>{ //returns boolean
    const target = users.find((user) => user.username === username);
    console.log(`current target: ${JSON.stringify(target)}`);
    if (target){
        return target.password === password;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(JSON.stringify(users));

    if (authenticatedUser(username, password)){
        let token = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });

        req.session.authentication = {token, username};

        return res.status(200).send("The user is authenticated and was successfully logged in");
    }
    else{
        return res.status(401).send("Authentication is required before login...");
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let book = books[req.params.isbn];
    if (book){
        if (req.query[req.session.authentication.username]){
            book.reviews[req.session.authentication.username] = req.query[req.session.authentication.username];
            return res.status(200).send("The review was updated succesfully");
        }
        else{
            return res.status(401).send("The username in the query is not loged in...");
        }
    }
    else{
        return res.status(404).sendStatus(`There is no book with the isbn: ${req.params.isbn}`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
