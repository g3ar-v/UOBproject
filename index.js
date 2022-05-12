const express = require("express");
require("dotenv").config();
const exphbs = require("express-handlebars");
const axios = require("axios");
const { spawn } = require("child_process");
const app = express();
const { Connection, Request } = require("tedious");
const { auth } = require("express-openid-connect");
const PORT = process.env.PORT;
const bodyParser = require("body-parser");

/* app.use(
  auth({
       issuerBaseURL: process.env.ISSUER_BASE_URL,
      baseURL: process.env.BASE_URL,
      clientID: process.env.CLIENT_ID,
      secret: process.env.,
      idpLogout: true, 
    })
); */

//Parse middleware
app.use(bodyParser.urlencoded({ extended: false }));

//Parse json
app.use(bodyParser.json());

//static files
app.use(express.static("public"));

app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

// app.post("/api/message", (req, res) => {
//   console.log(req.body.date);
// });
//Routing
// const userRoutes = require("./server/routes/user");
// // const { request } = require("express");
// app.use("/user/", userRoutes);

const attRoutes = require("./server/routes/attendance");
app.use("/att/", attRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
