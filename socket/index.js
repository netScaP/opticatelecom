//room: {sender, message}

import Event from '../models/event';

export default function handler(io, socket) {
	socket.on('join-to-event', function(room) {
		console.log('join-to-event');
		console.log(room);
		socket.join(room);
	});
	socket.on('chat-message', function(room, msg, sender) {
		console.log(room);
		console.log(msg);
		console.log(sender);
		io.to(room).emit('chat-message', msg, sender);
	});
}
