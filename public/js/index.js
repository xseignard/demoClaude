(function($) {

	var socket = io.connect(window.location.origin),
		colorPicker = $('#minicolors-input'),
		btn = $('#send-name'),
		name = $('#input-name')[0];
    

    window.addEventListener('deviceorientation', function(event) {
      var msg = {x: event.beta, y:event.gamma, z:event.alpha};
      socket.emit('message', msg);
    }, false);
    
    /*document.body.addEventListener('touchmove', function(event) {
        var touch = event.changedTouches[0];
        var msg = {x: touch.pageX, y:touch.pageY};
        console.log(msg);
        socket.emit('message', msg);
    }, false);*/

    /*
    colorPicker.minicolors({
    	changeDelay: 10,
    	change: function(hex, opacity) {
			var color = colorPicker.minicolors('rgbObject')
			console.log(color);
			socket.emit('message', color);
		}
    });

	btn.click(function() {
    	if (name.value.length > 0) {
    		console.log(name.value);
    		socket.emit('message', {name: name.value});
    		name.value='';
    	}
    });*/

}($));