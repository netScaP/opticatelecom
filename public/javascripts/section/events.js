var socket = io();

var app = new Vue({
	el: '.common-block',
	data: {
		events: [],
		currentPage: 1,
		perPage: 9,
		currentEvent: {},
		currentMsg: '',
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
				this.events = response.body;
				this.currentPage = page;
			}, console.log);
		},
		joinToEvent: function(id) {
			var options = {
				params: {
					'id': id
				}
			}
			this.$http.get('/api/join-to-event', options)
			.then(event => this.currentEvent = event.body);
			console.log(id);
			socket.emit('join-to-event', id);
		},
		sendMsg: function(e) {
			socket.emit('chat-message', this.currentEvent['_id'], this.currentMsg, 'uder');
			var options = {
				params: {
					id: this.currentEvent['_id'],
					msg: this.currentMsg
				}
			};
			this.$http.get('/chat-message', options);
			Vue.set(app, 'currentMsg', '');
			console.log(this.currentEvent);
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

		this.$http.get('/api/total-events')
		.then(function (response) {
			this.totalEvents = response.body.length;
		});
	}
});

socket.on('chat-message', function(msg, sender) {
	console.log(msg + ' ' + sender);
	console.log(app.$refs.messages);
	var li = document.createElement("li");
	li.innerText = sender + ': ' +msg;
	app.$refs.messages.append(li);	
});