
const sendEmail = require("../middleware/mailMessage");
const User = require("../models/UserModel");
const otpgenerator = require("otp-generator");



exports.logout = (req, res) => {
  try {
    req.session.destroy((err)=> {
      if (err){
        console.log(err);
        return false;
      }else{
        return res.redirect("/");
      }
    })
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/");
  }
};

exports.loginPage = (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.render("login");
    } else {
      return res.redirect("/dashboard");
    }
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/");
  }
};
exports.dashBoard = async (req, res) => {
   try {
    return res.render("dashboard");
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/");
  }
};  
exports.loginUser = async (req, res) => {
    try {
        console.log(req.body);
        let user = await User.findOne({email: req.body.email})
        console.log(user);
        if(user){
            if(user.password == req.body.password){
                res.cookie("user", user)
                return res.redirect("/dashboard")
            }else{
                console.log("Password is not matched");
                return res.redirect("/");
            }
        }else{
            console.log("User not Found");
            return res.redirect("/");
        }
    } catch (error) {
        return res.redirect("/");
    }
}
exports.profilePage = async (req, res) => {
    try {
        console.log(" Checking User Cookie:", req.cookies.user);
        if (!req.cookies.user) {
            console.log(" No user cookie found. Redirecting to login...");
            return res.redirect("/");
        }

        let user = await User.findById(req.cookies.user);
        if (!user) {
            console.log(" User not found in DB. Clearing cookie and redirecting...");
            res.clearCookie("user");
            return res.redirect("/");
        }

        console.log(" Found User:", user);

        let imagePath = user.image && user.image.startsWith("/uploads/") 
            ? user.image 
            : "/uploads/default-profile.png";

        console.log(" User Image Path:", imagePath);

        return res.render("profile", { user, imagePath });
    } catch (error) {
        console.error(" Error in profilePage:", error);
        return res.redirect("back");
    }
};


exports.changePasswordPage = async (req, res) => {
    try {
        const userCookie = req.cookies.user;
        if (!userCookie) {
            return res.redirect("/"); 
        }
        const user = await User.findById(userCookie._id);
        if (!user) {
            res.clearCookie("user");
            return res.redirect("/");
        }
        res.render("change_pass", { user });
    } catch (error) {
        console.error("Error rendering change password page:", error);
        return res.redirect("/");
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { old_password, password, c_password } = req.body;
        const userCookie = req.cookies.user;

        if (!userCookie) {
            return res.redirect("/"); 
        }

        const user = await User.findById(userCookie._id);

        if (!user) {
            return res.render("change_pass", { 
                error: " User not found",
                user: null
            });
        }
        if (user.password !== old_password) {
            console.log("Old password does not match");
            return res.render("change_pass", { user});
        }
        if (password !== c_password) {
            console.log(" Password & Confirm password do not match");
            return res.render("change_pass", {user});
        }
        user.password = password;
        await user.save();
        console.log("Password Updated Successfully");
        res.clearCookie("user");
        res.clearCookie("email");

        return res.redirect("/");

    } catch (error) {
        console.error(" Error in changePassword:", error);
        return res.render("change_pass", { 
            error: " Something went wrong, please try again.",
            user: req.cookies.user || null
        });
    }
};
exports.forgotPasswordPage = async (req, res) => {
  try {
    return res.render("auth/forgotpassword");
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/");
  }
};
exports.webpage = async (req, res) => {
  try {
    return res.render("webpages/blogs");
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/");
  }
};

exports.sendEmail = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("User not found");
      return res.redirect("/");
    }

    let otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let mailMessage = {
    from: 'fenamavani37@gmail.com',
    to: `mavanifena@gmail.com`,
    subject: "Reset Password for Admin Panel",
    html: `
    <h2>Hello </h2>
    <p>Your Reset password Pin is: ${otp}.</p>
    <p>This Password is valid only 5 Minutes.</p>

    <p>Thank You!!!!</p>
    `, // HTML body
  }

    sendEmail(mailMessage);
    res.cookie('otp', otp);
    res.cookie('email', user.email);
    return res.render('auth/otp-page');
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/");
  }
};

exports.verifyOTP = async(req, res) => {
  try {
    let otp = req.cookies.otp;
    if(otp == req.body.otp){
      res.clearCookie("otp");
      return res.render("auth/newPassword");
    }else{
      console.log("OTP is Not Verified!!!!");
      return res.redirect("back")
    }
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("/");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let email = req.cookies.email;
    let user = await User.findOne({email: email});
    if(user){
        if(req.body.cpassword == req.body.newpassword){
          await User.findByIdAndUpdate(user._id, {password: req.body.newpassword}, {new: true});
          res.clearCookie("email");
          return res.redirect("/");
        }else{
          console.log("Password is not matched");
          return res.redirect("back");
        }
    }else{
      return res.redirect("/");
    }
  } catch (error) {
    console.log("something Wrong");
    return res.redirect("back");
  }
};

    