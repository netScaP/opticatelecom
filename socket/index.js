//room: {sender, message}

export let chat_messages = {};

export default function handler(io, socket) {
	socket.on('chat', (msg) => {
		io.emit('chat', msg);
	});
	socket.on('chatP', (msg, sender) => {
		io.emit('chatP', msg, sender);
	});
	socket.on('room', function(room) {
		socket.join(room);
	});
	socket.on('roomMsg', function(second, message, sender) {
		var room = null;

		if (!!chat_messages[second + sender]) {
			room = second + sender;
		} else {
			room = sender + second;
		}

		chat_messages[room] = chat_messages[room] || [];
		chat_messages[room].push({
			sender,
			message
		});
		
		io.to(room).emit('chatP', message, sender);
	});
}

// сделать переменную chatmessages, экспортировать его. Импортировать в роуты типо апи и написать клиентскую часть с обращением к апи