var socket = io();
$(function () {
	console.log(socket);

	for (var i = $('.startMessaging').length - 1; i >= 0; i--) {
		$('.startMessaging')[i].addEventListener('click', goChatting, true);
	}

	for (var i = $('.sendMessage').length - 1; i >= 0; i--) {
		$('.sendMessage')[i].addEventListener('click', sendMessage, true);
	}

	$('#close')[0].addEventListener('click', function() {
		$('#chat')[0].style = 'opacity: 0; z-index: -100';
		$('#messages').html('');
	});

	socket.on('chatP', function(msg, sender){
		$('#messages').append($('<li>').append($('<span>').text(sender + ': ')).append($('<span>').text(msg)));
		$('#msg')[0].value = '';
		gotoBottom('messages');
		//window.scrollTo(0, document.body.scrollHeight);
	});
});

function gotoBottom(id){
   var element = document.getElementById(id);
   element.scrollTop = element.scrollHeight - element.clientHeight;
   console.log(element);
}

function goChatting(e) {
	var mainDiv  = e.target.parentNode;
	var userChat = mainDiv.getElementsByClassName('username')[0].innerHTML;
	var myName 	 = document.getElementById('myName').innerHTML;
	$('#userChat')[0].innerHTML = userChat;

	$.ajax({
		url: '/api/whatRoom',
		type: 'GET',
		data: {
			'first': userChat,
			'second': myName
		},
		success: function(response) {
			socket.emit('room', response);
		}
	});
	
	var chat_messages = null;
	$.ajax({
		url: '/api/getMessages',
		type: 'GET',
		data: {
			'first': userChat,
			'second': myName
		},
		success: function(response) {
			chat_messages = response;
			for (var i = 0; i < chat_messages.length; i++) {
				$('#messages').append($('<li>').append($('<span>').text(chat_messages[i].sender + ': ')).append($('<span>').text(chat_messages[i].message)));
			}
			gotoBottom('messages');
		}
	});
	document.getElementById('chat').style = 'opacity: 1; z-index: 100';
	return false;
}

function sendMessage(e) {
	e.preventDefault();
	var message = $('#msg')[0].value;

	var second 	= $('#userChat')[0].innerHTML;
	var sender 	= $('#myName')[0].innerHTML;
	
	socket.emit('roomMsg', second, message, sender);
}