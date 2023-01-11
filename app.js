const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("node:https");
const { dirname } = require("node:path");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  var data = JSON.stringify({
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  });

  const url = "https://us12.api.mailchimp.com/3.0/lists/5f72f81b3e/members";
  var options = {
    method: "POST",
    auth: "jefrey:49803c72ea0145782d2412236edd4b79-us12",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(data);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});

//API key: 49803c72ea0145782d2412236edd4b79-us12
//list id: 5f72f81b3e
