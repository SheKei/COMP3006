//sender: sender, recipient: recipient, message: message, timeStamp: timeStamp
let mongoose = require("mongoose");

let chatSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    message: String,
    timestamp: Date
});

let Chat = mongoose.model("chat", chatSchema);
module.exports.Chat = Chat;