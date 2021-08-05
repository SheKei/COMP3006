let mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
    userID: String,
    itemID:[String],
    orderQuantity:[Number],
    orderStatus: String,
    dateOfOrder: Date
});
//userID, itemID, orderQuantity, orderStatus, dateOfOrder
let Order = mongoose.model("order", orderSchema);
module.exports.Order = Order;