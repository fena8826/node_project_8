const express = require("express");
const { homepage,  registerpage, singleblog, loginuser,  contactpage, registeruser, productpage, singleproduct, singleProductPage, logout, loginPage } = require("../controller/web.controller");
const webroute = express.Router();
const passport = require("passport");
webroute.get("/", homepage);
webroute.get("/product",passport.checkAuthentication, productpage)
webroute.get("/singleblog/:id", singleblog);
webroute.get("/single-product/:id",passport.checkAuthentication,  singleProductPage )
webroute.get("/login", loginPage);
webroute.post("/login",passport.authenticate('local', {failureRedirect: "/web/login"}), loginuser);
webroute.get("/register", registerpage);
webroute.post("/register", registeruser);
webroute.get("/contact", contactpage);
webroute.get("/logout",logout)
webroute.get("product/view-product",productpage);
module.exports = webroute; 
  