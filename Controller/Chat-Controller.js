let db = require("../Database");
let session = require('express-session');
let mongoose = require("mongoose");

//Store chat message for later viewing
function logMessage(sender,recipient,message,timestamp){
    db.logChat(sender,recipient,message,timestamp);
}

//Load any messages from customer and admin
async function displayChatHistoryForCustomers(userID,response){
    let msg = await db.retrieveChatHistory(userID);
    let basketNum = await db.returnNumOfItemsInBasket(userID);

    if(msg.length>0){
        response.render("User_Contact_Shop",{"userID":userID,"msg":msg, "basketNum":basketNum});
    }
    else{
        response.render("User_Contact_Shop",{"userID":userID,"msg":[],"basketNum":basketNum});
    }
}

async function displayChatHistoryForAdmin(userID,response){
    let msg = await db.retrieveChatHistory(userID);
    let account = await db.getAccount(userID);
    let customers = await db.getListOfCustomers();
    if(msg.length>0){
        response.render("Employee_Customer_Support",{"msg":msg, "customers":customers});
    }
    else{
        if(customers.length > 0){
            response.render("Employee_Customer_Support",{"msg":"", "customers":customers});
        }else{
            response.redirect("/Employee_Home");
        }
    }
}

async function loadChosenChatroom(userID, response){
    let msg = await db.retrieveChatHistory(userID);
    let account = await db.getAccount(userID);
    let fullname = account.getFirstName() + " " + account.getSurname();
    displayChatroomForEmployee(msg,fullname,account.getUserID(), response);
}

async function loadDefaultChatroom(response){
    let customers = await db.getListOfCustomers();
    let defaultUser = await db.getAccount(customers[0]._id);
    let fullname = defaultUser.getFirstName() + " " + defaultUser.getSurname();

    let msg = await db.retrieveChatHistory(defaultUser.getUserID());
    displayChatroomForEmployee(msg,fullname, defaultUser.getUserID(),response);

}

async function displayChatroomForEmployee(msg,fullname,userID, response){
    let customers = await db.getListOfCustomers();

    if(msg.length>0){
        response.render("Employee_Customer_Support",{"msg":msg, "fullname":fullname,"userID":userID, "customers":customers});
    }
    else{
        if(customers.length > 0){
            response.render("Employee_Customer_Support",{"msg":[],"fullname":fullname,"userID":userID, "customers":customers});
        }else{
            response.redirect("/Employee_Home");
        }
    }
}



module.exports.logMessage = logMessage;
module.exports.displayChatHistoryForCustomers = displayChatHistoryForCustomers;
module.exports.displayChatHistoryForAdmin = displayChatHistoryForAdmin;
module.exports.loadDefaultChatroom = loadDefaultChatroom;
module.exports.loadChosenChatroom = loadChosenChatroom;