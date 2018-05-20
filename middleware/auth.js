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

export function ensureAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.hasRole('admin')) {
		return next();
	}

	req.flash('error', 'You are not an admin');
	return res.redirect('/user/signin');
};

export function ensureTechnician(req, res, next) {
	if (req.isAuthenticated() && req.user.hasRole('technician')) {
		return next();
	}

	req.flash('error', 'You are not an technician');
	return res.redirect('/user/signin');
};

export function ensureDispatcher(req, res, next) {
	if (req.isAuthenticated() && req.user.hasRole('dispatcher')) {
		return next();
	}

	req.flash('error', 'You are not an dispatcher');
	return res.redirect('/user/signin');
}