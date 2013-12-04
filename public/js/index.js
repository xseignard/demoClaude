(function($) {

	var socket = io.connect(window.location.origin),
		colorPicker = $('#minicolors-input'),
		btn = $('#send-name'),
		name = $('#input-name')[0];
    
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
    });

}($));