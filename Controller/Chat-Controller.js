let db = require("../database");
let session = require('express-session');
let mongoose = require("mongoose");

//Store chat message for later viewing
function logMessage(sender,recipient,message,timestamp){
    db.logChat(sender,recipient,message,timestamp);
}

async function displayChatHistoryForCustomers(userID,response){
    let msg = await db.retrieveChatHistory(userID);
    if(msg.length>0){response.render("User_Contact_Shop",{"userID":userID,"msg":msg});}
}

async function displayChatHistoryForAdmin(userID,response){
    let msg = await db.retrieveChatHistory(userID);
    let account = await db.getAccount(userID);
    let fullname = account.getFirstName() + " " + account.getSurname();
    if(msg.length>0){response.render("Employee_Customer_Support",{"msg":msg});}
}

module.exports.logMessage = logMessage;
module.exports.displayChatHistoryForCustomers = displayChatHistoryForCustomers;
module.exports.displayChatHistoryForAdmin = displayChatHistoryForAdmin;