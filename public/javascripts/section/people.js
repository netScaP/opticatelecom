var app = new Vue({
	el: '.common-block',
	data: {
		users: [],
		currentPage: 1,
		perPage: 9,
		totalUsers: 0,
		followingsUsers: [],
		search: '',
		isWidthLTE700: false,
		whichEventIsOpen: 'all'
	},
	methods: {
		fetchUsers: function(page) {
			var options = {
				params: {
					skip: (page - 1) * this.perPage,
					limit: this.perPage,
					search: this.search
				}
			};

			this.$http.get('/api/users', options)
			.then(function(response) {
				console.log(response.body);
				this.users = response.body;
				this.currentPage = page;
			}, console.log);
		},
		fetchTotalUsers: function() {
			var options = {
				params: {
					search: this.search
				}
			};

			this.$http.get('/api/users/total', options)
			.then(function (response) {
				this.totalUsers = response.body.length;
			});
		},
		followToUser: function(id, index) {
			this.$http.post('/api/users/follow/' + id);
			console.log('true');
			this.followingsUsers.unshift(this.users[index]);
			this.users.splice(index, 1);
		},
		quitUser: function(id, index) {
			this.$http.post('/api/users/quit/' + id);
			this.users.unshift(this.followingsUsers[index]);
			this.followingsUsers.splice(index, 1);
		}
	},
	watch: {
		search: function(newVal) {
			this.fetchUsers(1);
			this.fetchTotalUsers();
		}
	},
	created: function() {
		this.fetchUsers(this.currentPage);
		this.fetchTotalUsers();

		this.$http.get('/api/users/followings')
		.then(function (response) {
			this.followingsUsers = response.body;
		});

		this.isWidthLTE700 = window.innerWidth <= 700 ? true : false;
	}
});