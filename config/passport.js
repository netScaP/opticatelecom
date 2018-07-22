import passport from 'passport';
import User from '../models/user';
const LocalStrategy = require('passport-local').Strategy;

import config from './confirmCode';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    req.checkBody('name', "Name couldn't be is empty").notEmpty();
    req.checkBody('phone', "Invalid Phone").notEmpty().isLength({min:7});
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach((error) => {
           messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'username is already in use.'});
        }
        const newUser = new User();
        newUser.email = email;
        newUser.name = req.body.name;
        newUser.password = newUser.encryptPassword(password);
        newUser.phone = req.body.phone;
        newUser.followingsEvents = [];
        newUser.followingsUsers = [];
        
        newUser.save((err, result) => {
           if (err) {
               return done(err);
           }
           return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    emailField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    req.checkBody('email', 'Invalid email').notEmpty();
    req.checkBody('password', 'Invalid password').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));