const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Account = require("./models/account");

//create a server object:
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use(cors());

app.get("/", async (req, res) => {
  res.send("<h2>Hello</h2>");
});

app.post("/account", async (req, res) => {
  try {
    const { account_no, balance } = req.body;
    console.log(req.body);
    Account.findOne({ account_no }, (err, acc) => {
      if (acc) return res.json({ success: false, data: "User already exists" });
    });
    const account = new Account({
      account_no,
      balance: parseInt(balance)
    });
    account.save((err, acc) => {
      if (err) return res.json({ success: false, data: err.message });
      else {
        return res.json({
          success: true,
          data: { account_no: acc.account_no, balance: acc.balance }
        });
      }
    });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
});

app.get("/account", async (req, res) => {
  try {
    const { account_no } = req.body;
    Account.findOne({ account_no }, (err, acc) => {
      if (err) return res.json({ success: false, data: err.message });
      else {
        if (acc)
          return res.json({
            success: true,
            data: { account_no: acc.account_no, balance: acc.balance }
          });
        else return res.json({ success: false, data: "Account number wrong" });
      }
    });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
});

app.post("/debit", async (req, res) => {
  try {
    const { account_no, debit } = req.body;
    console.log(req.body);
    Account.findOne({ account_no }, (err, acc) => {
      if (err) return res.json({ success: false, data: err.message });
      else {
        if (acc) {
          if (acc.balance < parseInt(debit)) {
            return res.json({
              success: false,
              data: "Amount exceeded balance"
            });
          }
          Account.findByIdAndUpdate(
            acc._id,
            {
              balance: acc.balance - parseInt(debit)
            },
            { new: true },
            (err, account) => {
              if (err) return res.json({ success: false, data: err.message });
              else
                return res.json({
                  success: true,
                  data: {
                    account_no: account.account_no,
                    balance: account.balance
                  }
                });
            }
          );
        } else
          return res.json({ success: false, data: "Account number wrong" });
      }
    });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
});

app.post("/credit", async (req, res) => {
  try {
    const { account_no, credit } = req.body;
    console.log(req.body);
    Account.findOne({ account_no }, (err, acc) => {
      if (err) return res.json({ success: false, data: err.message });
      else {
        if (acc) {
          Account.findByIdAndUpdate(
            acc._id,
            {
              balance: acc.balance + parseInt(credit)
            },
            { new: true },
            (err, account) => {
              if (err) return res.json({ success: false, data: err.message });
              else
                return res.json({
                  success: true,
                  data: {
                    account_no: account.account_no,
                    balance: account.balance
                  }
                });
            }
          );
        } else
          return res.json({ success: false, data: "Account number wrong" });
      }
    });
  } catch (error) {
    return res.json({ success: false, data: error.message });
  }
});

const CONNECTION_URL =
  "mongodb+srv://dipti:Mamma6543@cluster0.s0dnh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3003;
console.log(process.env.PORT);
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((err) => console.log(err.message));
