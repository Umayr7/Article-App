const LocatStragegy = require('passport-local').Strategy
const User = require('../models/user')
const config = require('../config/database');
const bcrtypt = require('bcryptjs')

module.exports = (passport)=>{
    //Local Stragegy
    passport.use(new LocatStragegy((username, password, done)=>{
        //Match Username
        let query = {username:username}

        User.findOne(query, (err, user)=>{
        if(err) throw err
        if(!user) 
        {
            return done(null, false, {message: 'No user found'})
        }

        //Match Password
        bcrtypt.compare(password, user.password, (err, isMatch)=>{
            if(err) throw err
            if(isMatch)
            {
                return done(null, user)
            }
            else
            {
                return done(null, false, {message: 'Wrong password'})
            }
        })

        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}