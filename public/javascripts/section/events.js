var app = new Vue({
	el: '.common-block',
	data: {
		events: [],
		currentPage: 1,
		perPage: 9,
		currentEvent: {},
		eventIsOpen: false,
		totalEvents: 0
	},
	methods: {
		fetchEvents: function(page) {
			var options = {
				params: {
					skip: (page - 1) * this.perPage,
					limit: this.perPage
				}
			};

			this.$http.get('/api/events', options)
			.then(function(response) {
				console.log(response);
				this.events = response.body;
				this.currentPage = page;
			}, console.log);
		},
		joinToEvent: function(id) {
			this.$http.get('/api/join-to-event', id)
			.then(event => this.currentEvent = event.body);
		}
	},
	created: function() {
		var options = {
			params: {
				skip: 0,
				limit: this.perPage
			}
		}
		this.fetchEvents(this.currentPage);

		this.$http.get('/api/total')
		.then(function (response) {
			console.log(response.body);
			this.totalEvents = response.body.length;
		});
	}
})