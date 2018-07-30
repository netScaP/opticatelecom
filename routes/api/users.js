import express from 'express';

import User from '../../models/user';

import { notLoggedIn, ensureAuthenticated, isEventCreater } from '../../middleware/auth';

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res, next) => {
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

router.get('/followings', ensureAuthenticated, (req, res, next) => {
	User.findOne({ _id: req.user['_id'] })
		.populate('followingsUsers')
		.exec((err, users) => {
			console.log(users);
			res.send(users['followingsUsers']);
		});
});

router.get('/total', ensureAuthenticated, (req, res, next) => {
	User.find({ name: { $regex: ".*" + req.query['search'] + ".*", $options: 'i'} })
		.then(users => res.send(users))
		.catch(e => req.flash('error', e.message));
});

router.post('/follow/:id', ensureAuthenticated, (req, res, next) => {
	console.log(req.params);
	User.updateOne(
		{ _id: req.user['_id'] },
		{ $addToSet: { followingsUsers: req.params['id'] } }
	)
		.then(res => console.log(res))
		.catch(e => console.log(e));
});

router.post('/quit/:id', ensureAuthenticated, (req, res, next) => {
	console.log(req.body);
	User.updateOne(
		{ _id: req.user['_id'] },
		{ $pull: { followingsUsers: req.params['id'] } }
	)
		.then(user => console.log(user));
});


export default router;