const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/UserModel");

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async function (email, password, done) {
    let user = await User.findOne({email: email});
    if(!user){
        return done(null, false);
    }else{
        if(password == user.password){
            return done(null, user);
        }else{
            return done(null, false);
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    let user = await User.findById(id);
    if(user){
        done(null, user);
    }
});
passport.checkAuthentication = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        return res.redirect("/");
    }
}
passport.setAutheticatUser = (req, res, next) => {
    if(req.user){
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;