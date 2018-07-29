import express from 'express';

import User from '../models/user';
import Event from '../models/event';

import { notLoggedIn, ensureAuthenticated, isEventCreater } from '../middleware/auth';

const router = express.Router();


router.get('/events', ensureAuthenticated, (req, res, next) => {
	const currentDate = new Date().toISOString();
	const hashtags = req.query['hashtags'].length === 0 ? ['all'] : req.query['hashtags'];
	Event.find({
		_id: { 
			$nin: req.user['followingsEvents'] 
		}, 
		hashtags: { 
			$in: hashtags 
		},
		city: req.user['city'],
		startEvent: { $gte: currentDate }
	}).sort({ startEvent: 1 }).skip(+req.query.skip).limit(+req.query.limit)
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
	User.find({
		$and: [
			{_id: { $nin: req.user['followingsUsers'] } }, 
			{_id: { $ne: req.user['_id'] } } 
		],
		name: { $regex: ".*" + req.query['search'] + ".*", $options: 'i'}
	}).skip(+req.query.skip).limit(+req.query.limit)
		.then(users => {
			console.log(users);
			res.send(users)
		})
		.catch(e => {
			console.log(e);
			req.flash('error', e.message)
		});
});

router.get('/total-events', ensureAuthenticated, (req, res, next) => {
	const hashtags = req.query['hashtags'].length === 0 ? ['all'] : req.query['hashtags'];
	Event.find({
		_id: { 
			$nin: req.user['followingsEvents'] 
		}, 
		hashtags: { 
			$in: hashtags 
		},
		city: req.user['city']
	})
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
	User.find({ name: { $regex: ".*" + req.query['search'] + ".*", $options: 'i'} })
		.then(users => res.send(users))
		.catch(e => req.flash('error', e.message));
});

router.get('/follow-to-user', ensureAuthenticated, (req, res, next) => {
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
	const currentDate = new Date().toISOString();
	User.findOne({ 
		_id: req.user['_id']
	})
		.sort({ startEvent: 1 })
		.populate('followingsEvents')
		.exec((err, user) => {
			console.log(user);
			if (user)
				res.send(user['followingsEvents']);
			else {
				res.send([]);
			}
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

router.post('/update-event', ensureAuthenticated, (req, res, next) => {
	const event = req.body.params.event;
	event.createdBy = req.user['_id'];
	for (var i = event.hashtags.length - 1; i >= 0; i--) {
		if (event.hashtags[i] == '') {
			event.hashtags[i].splice(index, 1);
		}
	}
	Event.updateOne(
		{ _id: event['_id'] },
		event
	)
		.then((result) => console.log(result))
		.catch(e => {
			console.log(e);
			req.flash('error', e.message);
		});
});

router.get('/quit-from-event', ensureAuthenticated, (req, res, next) => {
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


//.sort({ $natural: -1 });
export default router;