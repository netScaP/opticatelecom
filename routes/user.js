import express from 'express';
import csrf from 'csurf';
import passport from 'passport';

import User from '../models/user';

import { notLoggedIn, ensureAuthenticated } from '../middleware/auth';

const router = express.Router();

const csrfProtection = csrf();

router.use(csrfProtection);

/* GET users listing. */
router.get('/logout', ensureAuthenticated, (req, res, next) => {
	req.logout();
	res.redirect('/');
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
	const messages = req.flash('error');
	console.log(messages);
	res.render('account/profile', {
		'user': req.user,
		messages,
		hasErrors: messages.length > 0
	});
});

router.get('/setting', ensureAuthenticated, (req, res, next) => {
	const messages = req.flash('error');
	console.log(messages);
	res.render('account/setting', {
		'user': req.user,
		csrfToken: req.csrfToken(),
		messages,
		hasErrors: messages.length > 0
	});
});

router.post('/setting', ensureAuthenticated, (req, res, next) => {

	const newUser = new User();
    newUser.username = req.body.username;
    newUser.password = req.body.password == '' ? req.user.password : newUser.encryptPassword(req.body.password);
    newUser.name = req.body.name;
    newUser.phone = +req.body.phone;
    newUser._id = req.user._id;
    
    User.updateOne( { username: req.body.username }, newUser, { upsert: true }, (err, result) => {
    	if (err) req.flash('error', err);

    	res.redirect('/user/profile');
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
	successRedirect: '/',
	failureFlash: true
}), (req, res, next) => {
	console.log(req.session);
	if (req.session.oldUrl) {
		const oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

export default router;