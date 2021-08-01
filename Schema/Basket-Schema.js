let mongoose = require("mongoose");

let basketSchema = new mongoose.Schema({
    userID: String,
    itemID: String,
    quantity: Number
});
//userID, itemID, quantity
let Basket = mongoose.model("basket", basketSchema);
module.exports.Basket = Basket;