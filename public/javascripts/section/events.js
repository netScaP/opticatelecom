var socket = io();
console.log(socket);
var app = new Vue({
	el: '.common-block',
	data: {
		events: [],
		cashEvents: {},
		hashtags: [],
		followingsEvents: [],
		currentPage: 1,
		perPage: 9,
		currentEvent: {},
		currentMsg: '',
		search: '',
		userId: '',
		userName: '',
		eventIsOpen: false,
		totalEvents: 0,
		isWidthLTE700: false,
		whichEventIsOpen: 'all',
	},
	filters: {
		normalizeDate: function(value) {
			if (value) {
				value = value.split('T');
				value[1] = value[1].split('.')[0];
				return value.join(' - ');
			}
		}
	},
	methods: {
		fetchEvents: function(page) {
			if (this.hashtags.length == 0 && this.cashEvents.hasOwnProperty(page)) {
				this.events = this.cashEvents[page];
				this.currentPage = page;
				return true;
			}

			var options = {
				params: {
					skip: (page - 1) * this.perPage,
					limit: this.perPage,
					hashtags: this.hashtags.length == 0 ? ['all'] : this.hashtags
				}
			};

			this.$http.get('/api/events', options)
			.then(function(response) {
				this.events = response.body;
				this.currentPage = page;
				if (this.hashtags.length == 0) {
					this.cashEvents[page] = response.body;
				}
			}, console.log);
		},
		fetchTotalEvents: function() {
			var options = {
				params: {
					hashtags: this.hashtags.length == 0 ? ['all'] : this.hashtags
				}
			};

			this.$http.get('/api/events/total', options)
			.then(function (response) {
				this.totalEvents = response.body.length;
			});
		},
		updateEvent: function(index, event) {
			for (var i = event['hashtags'].length - 1; i >= 0; i--) {
				if (event['hashtags'][i] == '') event['hashtags'].splice(index, 1);
			};

			var options = {
				params: {
					event: event
				}
			};

			this.$http.post('/api/events/update', options);
		},
		addHashtagEdit: function(index) {
			this.followingsEvents[index].hashtags.push('');
		},
		joinToEvent: function(id, index) {
			this.$http.post('/api/events/join/' + id)
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

			this.$http.post('/api/events/quit' + id);
		},
		sendMsg: function(e) {
			socket.emit('chat-message', this.currentEvent['_id'], this.currentMsg, this.userName);
			var options = {
				params: {
					id: this.currentEvent['_id'],
					msg: this.currentMsg
				}
			};
			this.$http.get('/chat-message', options);
			Vue.set(app, 'currentMsg', '');
		},
		addHashtag: function(hashtag) {
			if (typeof hashtag !== 'undefined') {
				this.hashtags.push(hashtag);
			} else {
				if (this.search === '') return false;
				this.hashtags.push(this.search.toLowerCase());
				Vue.set(app, 'search', '');
			}
			this.fetchEvents(1);
			this.fetchTotalEvents();
		},
		delHashtag: function(index) {
			this.hashtags.splice(index, 1);
			this.fetchEvents(1);
			this.fetchTotalEvents();
		}
	},
	created: function() {
		this.fetchEvents(this.currentPage);
		this.fetchTotalEvents();

		this.$http.get('/api/events/followings')
		.then(function (response) {
			this.followingsEvents = response.body;
		});

		this.isWidthLTE700 = window.innerWidth <= 700 ? true : false;
		console.log(window.innerWidth);
		console.log(this.isWidthLTE700);

	},
	updated: function() {
		gotoBottom('messages');
	},
	mounted: function() {
		console.log(this.$refs);
		this.userId = this.$refs['userId'].innerHTML;
		this.userName = this.$refs['userName'].innerHTML;
	}
});

socket.on('chat-message', function(msg, sender) {
	app.currentEvent.messages.push({
		senderName: sender,
		sender: 'You',
		message: msg
	});
	gotoBottom('messages');	
});

function gotoBottom(id){
	var element = document.getElementById(id);
	element.scrollTop = element.scrollHeight - element.clientHeight;
}