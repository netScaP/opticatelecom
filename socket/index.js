export function chatMessage(io, socket) {
	socket.on('chat', (msg) => {
		io.emit('chat', msg);
	});
	socket.on('chatP', (msg) => {
		io.emit('chatP', msg);
	});
}

export function privateMessage(io, socket) {
	socket.on('roomMsg', function(room, msg) {
		console.log(room);
		io.to(room).emit('chatP', msg);
	});
}

export function joinToRoom(io, socket) {
	socket.on('room', function(room) {
		socket.join(room);
	});
}