import express from 'express';

import User from '../models/user';
import Event from '../models/event';

import { notLoggedIn, ensureAuthenticated } from '../middleware/auth';

const router = express.Router();


router.get('/events', ensureAuthenticated, (req, res, next) => {
	console.log(req.query);
	console.log('im here');
	Event.find().sort({ $natural: 1 }).skip(+req.query.skip).limit(+req.query.limit)
		.then(events => res.send(events))
		.catch(e => req.flash('error', e.message));
});

router.get('/total', ensureAuthenticated, (req, res, next) => {
	Event.find()
		.then(events => res.send(events))
		.catch(e => req.flash('error', e.message));
});


//.sort({ $natural: -1 });
export default router;
