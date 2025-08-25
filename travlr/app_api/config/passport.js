const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require('../models/user'); 

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => { 
      try {
        const user = await User.findOne({ email: email }).exec(); 
        
        if (!user) {
          return done(null, false, {
            message: "Incorrect email.",
          });
        }
        
        const isValid = await user.comparePassword(password); 
        if (!isValid) {
          return done(null, false, {
            message: "Incorrect password.",
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});