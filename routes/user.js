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
	console.log(req.user);
	res.render('account/setting', {
		'user': req.user,
		csrfToken: req.csrfToken(),
		messages,
		hasErrors: messages.length > 0
	});
});

router.post('/setting', ensureAuthenticated, (req, res, next) => {

	const newUser = new User();
    newUser.email = req.query.email == '' ? req.user.email : req.body.email;
    newUser.password = req.body.password == '' ? req.user.password : newUser.encryptPassword(req.body.password);
    newUser.name = req.query.name == '' ? req.user.name : req.body.name;;
    newUser.phone = req.body.phone == '' ? +req.user.phone : +req.body.name;
    newUser.city = req.body.city == '' ? req.user['city'] : req.body['city'];
    newUser._id = req.user._id;

    if (req.body.phone.length < 7 || !Number.isInteger(+req.body.phone)) {
    	req.flash('error', 'Wrong Phone')
    }
    if (req.body.password !== '' ) {
	    if (req.body.password.length < 4) {
	    	req.flash('error', 'Password must be longer');
	    }
    }
    
    User.updateOne( { email: req.user.email }, newUser, { upsert: true })
    	.then(() => res.redirect('/user/profile'))
    	.catch(e => req.flash('error', e.message));

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
		return res.redirect(oldUrl);
	}
	res.redirect('/');
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
		return res.redirect(oldUrl);
	}
	res.redirect('/user/profile');
});

export default router;