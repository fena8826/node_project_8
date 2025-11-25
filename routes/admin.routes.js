const express = require("express");
const userRoutes = express.Router();
const passport = require('passport')
const {addUserPage,viewAllUserPage,addNewUser,deleteUser,editUserPage, updateUser,} = require("../controller/user.controller");

const upload = require("../middleware/uploadImage");

userRoutes.get("/add-user",passport.checkAuthentication,  addUserPage);
userRoutes.get("/view-users",passport.checkAuthentication,  viewAllUserPage);
userRoutes.post("/add-user", upload.single("image"), addNewUser);
userRoutes.get("/delete-user/:id", deleteUser);
userRoutes.get("/edit-user/:id",passport.checkAuthentication,  editUserPage);
userRoutes.post("/update-user/:id", upload.single("image"), updateUser);



module.exports = userRoutes;
