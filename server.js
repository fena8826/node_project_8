const express = require("express");
const port = 9005;
const path = require("path");
const dbconnect = require("./config/DbConnection");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');
const localStrategy = require("./middleware/localStrategy");
const webroute = require("./routes/web.routes");
const flash = require("connect-flash");
const flashMessage = require("./middleware/flashmessage");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));   
app.use(flash())
app.use(session({
    name : "testing",
    secret: "hello",
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000*60*60
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAutheticatUser);
app.use(flashMessage.setFlashMessage)

app.use("/", require("./routes/index.routes")); 


app.use("/web", require('./routes/web.routes'))

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});







