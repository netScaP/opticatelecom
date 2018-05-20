import express from 'express';

import Task from '../models/task';
import User from '../models/user';

import { notLoggedIn, ensureAuthenticated, ensureAdmin, ensureTechnician, ensureDispatcher } from '../middleware/auth';

const router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, (req, res, next) => {
	const messages = req.flash('error');
	const isAdmin = req.user.hasRole('admin');
	res.render('index', { 
		title: 'Arapp',
		isAdmin,
		messages, 
		hasErrors: messages.length > 0,
		hasAcces: req.user.hasRole('dispatcher') || req.user.hasRole('admin')
	});
});

router.get('/admin', ensureAuthenticated, ensureAdmin, (req, res, next) => {
	const messages = req.flash('error');
	const isAdmin = req.user.hasRole('amdin');
	User.find({ confirmed: false }, (err, result) => {
		req.flash('error', err);
		res.render('admin/admin', {
			result,
			isAdmin,
			messages,
			hasErrors: messages.length > 0
		});
	});
});

router.post('/confirmUser', ensureAuthenticated, ensureAdmin, (req, res, next) => {
	User.updateOne(
		{ email: req.body.email },
		{ $set: { confirmed: true } },
		(err, result) => {
			if (err) req.flash('error', err);
			res.redirect('/admin');
		}
	);
});

router.get('/tasks', ensureAuthenticated, (req, res, next) => {
	const messages = req.flash('error');

	const isTech = req.user.hasRole('technician');
	const isDisp = req.user.hasRole('dispatcher');
	const isAdmin = req.user.hasRole('amdin');
	Task.find({}, (err, result) => {
		console.log(result[0]);
		res.render('tasks', {
			result,
			isTech,
			isDisp,
			isAdmin,
			messages, 
			hasErrors: messages.length > 0
		});
	}).sort({ $natural: -1 });
});

router.post('/newTask', ensureAuthenticated, ensureDispatcher, (req, res, next) => {
	const newTask = new Task({
		dispatcher: req.user,
		authorPhone: req.body.phone,
		name: req.body.name,
		task: req.body.task
	});

	newTask.save((err, result) => {
		if (err) {
			throw new Error("Cann't save new Task");
		}
		return res.redirect('/');
	});
});

router.post('/newStatus', ensureAuthenticated, ensureAuthenticated, (req, res, next) => {
	if (req.user.hasRole('dispatcher')) {
		Task.findOneAndUpdate(
			{ _id: req.body.taskId },
			{ $set: { status: req.body.newStatus } },
			(err, result) => {
				if (err) req.flash('error', err);
				res.redirect('/tasks');
			}
		);
	} else {
		Task.findOneAndUpdate(
			{ _id: req.body.taskId },
			{ $set: { status: req.body.newStatus, gotTask: req.user } },
			(err, result) => {
				if (err) return req.flash('error', err);
				if (err) req.flash('error', err);
				res.redirect('/tasks');
			}
		);
	}
});

export default router;
