const mongoose = require("mongoose");

const accSchema = mongoose.Schema({
  account_no: {
    type: String
  },

  balance: {
    type: Number,
    default: 0
  },
  name: { type: String, default: "" }
});

const Account = new mongoose.model("Account", accSchema);

module.exports = Account;
