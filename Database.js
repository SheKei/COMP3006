let mongoose = require("mongoose");

//CONNECT TO DATABASE
let dbUrl = "mongodb://localhost:27017/butterflydb";
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true});

//IMPORT SCHEMAS
let Account = require("./Schema/Account-Schema").Account;
let Book = require("./Schema/Book-Schema").Book;

//IMPORT MODEL CLASSES