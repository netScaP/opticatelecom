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
};