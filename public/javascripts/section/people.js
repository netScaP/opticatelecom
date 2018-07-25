var app = new Vue({
	el: '.common-block',
	data: {
		users: [],
		currentPage: 1,
		perPage: 9,
		totalUsers: 0,
		followingsUsers: []
	},
	methods: {
		fetchUsers: function(page) {
			var options = {
				params: {
					skip: (page - 1) * this.perPage,
					limit: this.perPage
				}
			};

			this.$http.get('/api/users', options)
			.then(function(response) {
				console.log(response.body);
				this.users = response.body;
				this.currentPage = page;
			}, console.log);
		},
		followToUser: function(id, index) {
			var options = {
				params: {
					'id': id
				}
			}
			this.$http.get('/api/follow-to-user', options);
			console.log('true');
			this.followingsUsers.unshift(this.users[index]);
			this.users.splice(index, 1);
		},
		quitUser: function(id, index) {
			var options = {
				params: {
					'id': id
				}
			};
			this.$http.get('/api/quit-from-user', options);
			this.users.unshift(this.followingsUsers[index]);
			this.followingsUsers.splice(index, 1);
		}
	},
	created: function() {
		var options = {
			params: {
				skip: 0,
				limit: this.perPage
			}
		}
		this.fetchUsers(this.currentPage);

		this.$http.get('/api/total-users')
		.then(function (response) {
			this.totalUsers = response.body.length;
		});

		this.$http.get('/api/followings-users')
		.then(function (response) {
			console.log(response.body);
			this.followingsUsers = response.body;
			console.log(this.followingsUsers);
		});
	}
});