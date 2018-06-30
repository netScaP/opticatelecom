import express from 'express';

import User from '../models/user';

import { notLoggedIn, ensureAuthenticated } from '../middleware/auth';

import { chat_messages } from '../socket';

const router = express.Router();

router.get('/getMessages', (req, res, next) => {
	//const room = req.query.room;
	const first = req.query.first;
	const second = req.query.second;

	var msgs = [];

	if (!!chat_messages[first + second]) {
		msgs = chat_messages[first + second];
	} else {
		msgs = chat_messages[second + first] || [];
	}
		
	res.send(msgs);
});

router.get('/whatRoom', (req, res, next) => {
	const first = req.query.first;
	const second = req.query.second;

	var room = 'fuckRoom';

	if (!!chat_messages[first + second]) {
		room = first + second;
	} else {
		room = second + first;
	}
	
	res.send(room);
})

export default router;
