import express from 'express';

import User from '../models/user';

import { notLoggedIn, ensureAuthenticated } from '../middleware/auth';

const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, (req, res, next) => {
	const messages = req.flash('error');
	res.render('index', { 
		title: 'Arapp',
		messages, 
		hasErrors: messages.length > 0
	});
});

router.get('/people', ensureAuthenticated, (req, res, next) => {
	const messages = req.flash('error');
	User.find((err, users) => {
		res.render('sections/people', {
			title: 'Arapp',
			messages,
			hasErrors: messages.length > 0,
			users
		});
	});
});


//.sort({ $natural: -1 });
export default router;
