var socket = io();

var app = new Vue({
	el: '.common-block',
	data: {
		events: [],
		followingsEvents: [],
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
		joinToEvent: function(id, index) {
			var options = {
				params: {
					'id': id
				}
			}
			this.$http.get('/api/join-to-event', options)
			.then(event => this.currentEvent = event.body);
			socket.emit('join-to-event', id);

			if (typeof index !== 'undefined') {
				this.followingsEvents.unshift(this.events[index]);
				this.events.splice(index, 1);
			}
		},
		quitEvent: function(id, index) {
			this.events.unshift(this.followingsEvents[index]);
			this.followingsEvents.splice(index, 1);
			var options = {
				params: {
					'id': id
				}
			}
			this.$http.get('/api/quit-from-event', options);
		},
		sendMsg: function(e) {
			socket.emit('chat-message', this.currentEvent['_id'], this.currentMsg, 'You');
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

		this.$http.get('/api/followings-events')
		.then(function (response) {
			console.log(response.body);
			this.followingsEvents = response.body;
		});
	},
	updated: function() {
		gotoBottom('messages');
	}
});

socket.on('chat-message', function(msg, sender) {
	// var li = document.createElement("li");
	// li.classList.add('new-message');

	// li.innerHTML = "<span class='sender'>" + sender + ":</span><span class='message'>" + msg + "</span>";
	// app.$refs.messages.append(li);
	app.currentEvent.messages.push({
		senderName: sender,
		sender: 'You',
		message: msg
	});
	console.log(app.currentEvent);
	gotoBottom('messages');	
});

function gotoBottom(id){
	var element = document.getElementById(id);
	element.scrollTop = element.scrollHeight - element.clientHeight;
}