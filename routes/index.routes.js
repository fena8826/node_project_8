const express = require('express');
const routes = express.Router();
const passport = require('passport')
const {dashBoard, loginPage, loginUser, logout,profilePage,changePassword, changePasswordPage, forgotPasswordPage, sendEmail, verifyOTP, resetPassword} = require("../controller/index.controller");

routes.get("/", loginPage);
routes.get("/dashboard",passport.checkAuthentication, dashBoard);    
routes.get("/change-password",passport.checkAuthentication,  changePasswordPage);
routes.post("/change-password", changePassword);
routes.post("/login", passport.authenticate('local', {failureRedirect: "/"}), loginUser);
routes.get("/logout", logout);
routes.get("/profile",passport.checkAuthentication,  profilePage); 
routes.get("/forgot-password", forgotPasswordPage);
routes.post("/send-email", sendEmail);
routes.post("/verify-otp", verifyOTP);
routes.post("/reset-password", resetPassword);



routes.use("/user", require('./admin.routes'))
routes.use("/blog", require('./blog.routes'))

routes.use("/category", require('./category.routes'))
routes.use("/subcategory", require('./subCategory.routes'))
routes.use("/extracategory", require('./extraCategory.routes'))
routes.use("/product", require('./product.routes'))

module.exports = routes;