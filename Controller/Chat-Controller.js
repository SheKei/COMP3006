let db = require("../database");
let session = require('express-session');
let mongoose = require("mongoose");

function logMessage(sender,recipient,message,timestamp){
    db.logChat(sender,recipient,message,timestamp);
}

module.exports.logMessage = logMessage;