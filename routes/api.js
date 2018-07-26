import express from 'express';

import User from '../models/user';
import Event from '../models/event';

import { notLoggedIn, ensureAuthenticated } from '../middleware/auth';

const router = express.Router();


router.get('/events', ensureAuthenticated, (req, res, next) => {
	console.log(req.query);
	Event.find({_id: { $nin: req.user['followingsEvents'] }, hashtags: { $in: req.query['hashtags'] } }).skip(+req.query.skip).limit(+req.query.limit)
		.then(events => {
			console.log(events);
			res.send(events)
		})
		.catch(e => {
			console.log(e);
			req.flash('error', e.message)
		});
});

router.get('/users', ensureAuthenticated, (req, res, next) => {
	User.find({ $and: [
		{_id: { $nin: req.user['followingsUsers'] } }, 
		{_id: { $ne: req.user['_id'] } } 
	]}).sort({ $natural: 1 }).skip(+req.query.skip).limit(+req.query.limit)
		.then(users => res.send(users))
		.catch(e => req.flash('error', e.message));
});

router.get('/total-events', ensureAuthenticated, (req, res, next) => {
	console.log(req.query);
	console.log('total-events');
	Event.find({_id: { $nin: req.user['followingsEvents'] }, hashtags: { $in: req.query['hashtags'] } })
		.then(events => {
			console.log(events);
			res.send(events)
		})
		.catch(e => {
			console.log(e);
			req.flash('error', e.message)
		});
});

router.get('/total-users', ensureAuthenticated, (req, res, next) => {
	User.find()
		.then(users => res.send(users))
		.catch(e => req.flash('error', e.message));
});

router.get('/follow-to-user', ensureAuthenticated, (req, res, next) => {
	console.log(req.query);
	console.log(req.query.id);
	console.log(req.user['_id']);
	User.updateOne(
		{ _id: req.user['_id'] },
		{ $addToSet: { followingsUsers: req.query.id } }
	)
		.then(res => console.log(res))
		.catch(e => console.log(e));
});

router.get('/quit-from-user', ensureAuthenticated, (req, res, next) => {
	User.updateOne(
		{ _id: req.user['_id'] },
		{ $pull: { followingsUsers: req.query['id'] } }
	)
		.then(user => console.log(user));
});

router.get('/followings-users', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.user['_id'] })
		.populate('followingsUsers')
		.exec((err, users) => {
			console.log(users);
			res.send(users['followingsUsers']);
		});
});

router.get('/followings-events', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.user['_id'] })
		.populate('followingsEvents')
		.exec((err, user) => {
			console.log(user);
			res.send(user['followingsEvents']);
		});
});

router.get('/join-to-event', ensureAuthenticated, (req, res, next) => {
	Event.findOneAndUpdate(
		{ _id: req.query['id'] },
		{ $addToSet: { followers: req.user['_id'] } }
	)
		.then(event => res.send(event))
		.catch(e => req.flash('error', e.message));
	User.updateOne(
		{ _id: req.user['_id'] },
		{ $addToSet: { followingsEvents: req.query['id'] } }
	)
		.catch(e => req.flash('error', e.message));
});

router.get('/quit-from-event', ensureAuthenticated, (req, res, next) => {
	console.log('req');
	console.log(req.query);
	Event.updateOne(
		{ _id: req.query['id'] },
		{ $pull: { followers: req.user['_id'] } }
	)
		.then(() => Event.remove({ followers: { $exists: true, $size: 0 } }));

	User.updateOne(
		{ _id: req.user['_id'] },
		{ $pull: { followingsEvents: req.query['id'] } }
	)
		.then(user => console.log(user));
});

router.get('/search-events', ensureAuthenticated, (req, res, next) => {
	console.log(req.query);
	console.log('search');
	Event.find({ $text: { $search: req.query['query'] } }).then(events => console.log(events));
});

//.sort({ $natural: -1 });
export default router;
