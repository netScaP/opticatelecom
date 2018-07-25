import express from 'express';

import User from '../models/user';
import Event from '../models/event';

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
	const fuckYouser = req.user.username;
	User.find()
		.then(users => res.render('sections/people', {
			title: 'Arapp',
			messages,
			hasErrors: messages.length > 0,
			users,
			fuckYouser
		}))
		.catch(e => req.flash('error', e.message));
});

router.get('/events', ensureAuthenticated, (req, res, next) => {
	const messages = req.flash('error');
	res.render('sections/events', {
		messages,
		hasErrors: messages.length > 0
	});
});

// router.get('/follow-to-event/:id', ensureAuthenticated, (req, res, next) => {
// 	User.updateOne(
// 		{ email: req.user.email },
// 		{ $push: { followingsEvents: req.params.id }}
// 	)
// 	.catch(e => req.flash('error', e.message));

// 	Event.updateOne(
// 		{ _id: req.params.id },
// 		{ $push: { followers: req.user['_id'] } }
// 	)
// 	.catch(e => req.flash('error', e.message));
// });

// router.get('/follow-to-user/:id', ensureAuthenticated, (req, res, next) => {
// 	User.updateOne(
// 		{ _id: req.params.id },
// 		{ $push: { followingsUsers: req.user['_id'] } }
// 	)
// 	.catch(e => req.flash('error', e.message));
// });

router.get('/create-event', ensureAuthenticated, (req, res, next) => {
	const messages = req.flash('error');
	res.render('sections/create-event', {
		messages,
		hasErrors: messages.length > 0
	});
});

router.post('/create-event', ensureAuthenticated, (req, res, next) => {
	const newEvent = new Event();
	newEvent.title = req.body.title;
	newEvent.content = req.body.content;
	newEvent.city = req.body.city;
	newEvent.createdBy = req.user['_id'];
	newEvent.messages = [{
		sender: req.user['_id'],
		senderName: req.user['name'],
		message: 'Create an event'
	}];
	newEvent.followers = [ req.user['_id'] ];

	newEvent.save()
	.then(() => res.redirect('/events'))
	.catch(e => req.flash('error', e.message));
	console.log(newEvent);
	User.updateOne(
		{ _id: req.user['_id'] },
		{ $addToSet: { followingsEvents: newEvent['_id'] } }
	)
		.catch(e => req.flash('error', e.message));
});

router.get('/chat-message', ensureAuthenticated, (req, res, next) => {
	console.log(req.query);
	console.log(req.user);
	Event.updateOne(
		{ _id: req.query.id },
		{ $push: { 
			messages: {
				sender: req.user['_id'],
				senderName: req.user.name,
				message: req.query.msg
			} 
		} }
	)
	.then(res => console.log(res))
	.catch(e => console.log(e));
});

//.sort({ $natural: -1 });
export default router;
