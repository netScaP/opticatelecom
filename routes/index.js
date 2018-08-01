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
		hasErrors: messages.length > 0,
		city: req.user['city'],
		userId: req.user['_id'],
		userName: req.user['name']
	});
});

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
	newEvent.hashtags = ['all'].concat(req.body['hashtags'].toLowerCase().split(', '));
	newEvent.startEvent = new Date(req.body['startEvent']);
	newEvent.endEvent = new Date(req.body['endEvent']);

	newEvent.save()
	.then(() => res.redirect('/events'))
	.catch(e => req.flash('error', e.message));

	User.updateOne(
		{ _id: req.user['_id'] },
		{ $addToSet: { followingsEvents: newEvent['_id'] } }
	)
		.catch(e => req.flash('error', e.message));
});

router.get('/chat-message', ensureAuthenticated, (req, res, next) => {
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
