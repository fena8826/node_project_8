const User = require("../models/UserModel");
const path = require("path");
const fs = require("fs");

exports.addUserPage = async (req, res) => {
    return res.render("add_user")
  };

exports.viewAllUserPage = async (req, res) => {

    let users = await User.find();
    return res.render("view_all_user", { users});
  }

exports.addNewUser = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      req.body.image = imagePath;
    }
    let user = await User.create(req.body);
     if (user) {
      console.log("User Created");
      req.flash("success", "New User Added!!!!");
      return res.redirect("/user/add-user");
    } else {
      console.log("Something Error");
      req.flash("error", "Something Error");
      return res.redirect("/user/add-user");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Error");
    return res.redirect("/");
  }
};

exports.editUserPage = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      return res.render("edit_user", { user });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
       req.flash("success", "User Deleted Succesfully!!");
      return res.redirect("/user/view-users"); 
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "Something Error");
    return res.redirect("/user/view-users");
  }
};


exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (user) {
      if (req.file) {
        let imagePath = "";
        if (user.image !== "") {
          imagePath = path.join(__dirname, "..", user.image);
          try {
            await fs.unlinkSync(imagePath);
          } catch (error) {
            console.log("Image Not Found...");
          }
        }
        imagePath = `/uploads/${req.file.filename}`;
        req.body.image = imagePath;
      }

      let updateUser = await User.findByIdAndUpdate(user._id, req.body, {
        new: true,
      });
      if (updateUser) {
        req.flash("success", "User Updated Successfully!!");
        return res.redirect("/user/view-users");
      } else {
        req.flash("error", "Something Error");zz
        return res.redirect("/user/view-users");
      }
    } else {
      return res.redirect("/user/view-users");
    }
  } catch (error) {
    console.log(error);
  }
};



