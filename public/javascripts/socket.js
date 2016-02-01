var socket = io();

socket.on('delete', function(msg){
	location.reload();
});

socket.on('add', function(msg){
	location.reload();
});