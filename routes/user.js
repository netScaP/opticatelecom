import express from 'express';
import csrf from 'csurf';
import passport from 'passport';

import Task from '../models/task';

import { notLoggedIn, ensureAuthenticated, ensureAdmin, ensureTechnician, ensureDispatcher } from '../middleware/auth';

const router = express.Router();

const csrfProtection = csrf();

router.use(csrfProtection);

/* GET users listing. */
router.get('/logout', ensureAuthenticated, (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile', (req, res, next) => {
    const messages = req.flash('error');
    Task.find({ gotTask: req.user }, (err, result) => {
        if (err ) req.flash('error', err);
        res.render('account/profile', {
            profile: req.user,
            tasks: result,
            messages, 
            hasErrors: messages.length > 0
        });
    });
});

// USE USE USE USE USE USE NOT GET OR POST
router.use('/', notLoggedIn, (req, res, next) => {
    next();
});


router.get('/signup', (req, res, next) => {
	const messages = req.flash('error');
    res.render('account/create', {
        csrfToken: req.csrfToken(), 
        messages, 
        hasErrors: messages.length > 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/');
    }
});

router.get('/signin', (req, res, next) => {
    const messages = req.flash('error');
    res.render('account/login', {
        csrfToken: req.csrfToken(), 
        messages, 
        hasErrors: messages.length > 0
    });
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), (req, res, next) => {
    if (req.session.oldUrl) {
        const oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

export default router;