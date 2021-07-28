let mongoose = require("mongoose");

let accountSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    birthday: Date,
    email:String,
    streetName: String,
    postCode: String
});

let Account = mongoose.model("account", accountSchema);
module.exports.Account = Account;