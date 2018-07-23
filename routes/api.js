import express from 'express';

import User from '../models/user';
import Event from '../models/event';

import { notLoggedIn, ensureAuthenticated } from '../middleware/auth';

const router = express.Router();


router.get('/events', ensureAuthenticated, (req, res, next) => {
	Event.find().sort({ $natural: 1 }).skip(+req.query.skip).limit(+req.query.limit)
		.then(events => res.send(events))
		.catch(e => req.flash('error', e.message));
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
	Event.find()
		.then(events => res.send(events))
		.catch(e => req.flash('error', e.message));
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

router.get('/followings-users', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.user['_id'] })
		.populate('followingsUsers')
		.exec((err, users) => {
			console.log(users);
			res.send(users['followingsUsers']);
		});
});

router.get('/join-to-event', ensureAuthenticated, (req, res, next) => {
	Event.findOneAndUpdate(
		{ _id: req.query['id'] },
		{ $addToSet: { followers: req.user['_id'] } }
	)
		.then(event => res.send(event))
		.catch(e => req.flash('error', e.message));
});


//.sort({ $natural: -1 });
export default router;
