export function notLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/');
}

export function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/user/signin');
}

export function isEventCreater(req, res, next) {
	if (req.user['_id'] == req.body.params.event['_id']) {
		return next();
	}
	return res.redirect('/events');
}