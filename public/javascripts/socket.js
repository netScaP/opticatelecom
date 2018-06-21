$(function () {
	var socket = io();
	$('#chatform').submit(function(){
		socket.emit('chat', $('#m').val());
		$('#m').val('');
		return false;
	});
	$('#toRoom').click(function() {
		socket.emit('room', 'test');
		$('.open').css('opacity', 1);
	});
	$('#privateChat').submit(function() {
		socket.emit('roomMsg', $('#test')[0].value, $('#msg').val());
		return false;
	});
	socket.on('chat', function(msg){
		$('#messages').append($('<li>').text(msg));
		window.scrollTo(0, document.body.scrollHeight);
	});
	socket.on('chatP', function(msg){
		$('#messagesP').append($('<li>').text(msg));
		window.scrollTo(0, document.body.scrollHeight);
	});
});