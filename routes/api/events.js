import express from 'express';

import User from '../../models/user';
import Event from '../../models/event';

import { notLoggedIn, ensureAuthenticated, isEventCreater } from '../../middleware/auth';

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res, next) => {
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
			res.send(events)
		})
		.catch(e => {
			req.flash('error', e.message)
		});
});

router.get('/total', ensureAuthenticated, (req, res, next) => {
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
			res.send(events)
		})
		.catch(e => {
			req.flash('error', e.message)
		});
});

router.get('/followings', ensureAuthenticated, (req, res, next) => {
	const currentDate = new Date().toISOString();
	User.findOne({ 
		_id: req.user['_id']
	})
		.sort({ startEvent: 1 })
		.populate('followingsEvents')
		.exec((err, user) => {
			if (user)
				res.send(user['followingsEvents']);
			else {
				res.send([]);
			}
		});
});

router.post('/join/:id', ensureAuthenticated, (req, res, next) => {
	Event.findOneAndUpdate(
		{ _id: req.params['id'] },
		{ $addToSet: { followers: req.user['_id'] } }
	)
		.then(event => res.send(event))
		.catch(e => req.flash('error', e.message));
	User.updateOne(
		{ _id: req.user['_id'] },
		{ $addToSet: { followingsEvents: req.params['id'] } }
	)
		.catch(e => req.flash('error', e.message));
});

router.post('/update', ensureAuthenticated, (req, res, next) => { //!!
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
			req.flash('error', e.message);
		});
});

router.post('/quit/:id', ensureAuthenticated, (req, res, next) => {
	Event.updateOne(
		{ _id: req.params['id'] },
		{ $pull: { followers: req.user['_id'] } }
	)
		.then(() => Event.remove({ followers: { $exists: true, $size: 0 } }));

	User.updateOne(
		{ _id: req.user['_id'] },
		{ $pull: { followingsEvents: req.params['id'] } }
	)
		.then(user => console.log(user));
});


export default router;