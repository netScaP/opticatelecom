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
			this.followingsUsers.push(this.users[index]);
			this.users.splice(index, 1);
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