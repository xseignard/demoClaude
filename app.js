var express = require('express'),
    app = express(),
    V4PortReceive = 5000,
    V4PortSend = 5001,
    V4Ip = '82.235.242.164',
    dgram = require('dgram'),
    clients = {},
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    PORT = process.env.PORT || 9999;


server.listen(PORT);

// middlewares
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// routes
/*app.get('/', function (req,res) {
    res.sendfile(__dirname + '/public/index.html');
});*/

io.set('log level', 1);
serverUdp = dgram.createSocket('udp4');
serverUdp.bind(V4PortSend);

io.sockets.on('connection', function (socket) {
    if(!clients[socket.id]) {
        clients[socket.id] = socket;        
        var jsonObject = createJSONString('Connect', socket.id);
        var jsonString = JSON.stringify(jsonObject);
        UDPSend(jsonString,V4Ip,V4PortReceive)
    }   
    
    // handle client messages
    socket.on('message', function (msg) { 
        // this is the json object we will send to vvvv
        var jsonObject = createJSONString('Update', socket.id);
        // add all key - value pairs the client sent
        for(var key in msg) {
          jsonObject.MessageData[key] = msg[key];
        }
        // stringify and send
        var jsonString = JSON.stringify(jsonObject);
        console.log(jsonString);
        UDPSend(jsonString,V4Ip,V4PortReceive)
    });
 
    // handle server messages
    var callback = function (msg, rinfo) {
        var jsonObject = JSON.parse(msg.toString('ascii', 0, rinfo.size));
        var socketId = jsonObject.MessageData.SocketId.Spread[0];
        // broadcast message
        if (socketId =='broadcast') {
            socket.emit('vvvv',jsonObject);
        } 
        // message for a specified client
        else if(clients[socketId]) {
            clients[socketId].emit('vvvv',jsonObject);
        }
    };
    serverUdp.on('message', callback);
    
    // remove client id and event listener on disconnect
    socket.on('disconnect', function () { 
        var jsonObject = createJSONString('Disconnect', socket.id);
        var jsonString = JSON.stringify(jsonObject);
        UDPSend(jsonString, V4Ip, V4PortReceive) 
        
        delete clients[socket.id];
        serverUdp.removeListener('message', callback);
    });
    
});

var createJSONString = function(action, socketId) {
    var jsonObject = { 
        MessageData : {
            MessageType : { 
                Type : 'string', 
                Spread : [action]
            },
            SocketId : { 
                Type : 'string',
                Spread : [socketId]
            },
        },
        Address : 'SocketData'
    };
    return jsonObject;

};


var UDPSend = function(message,Host,port){
    var client = dgram.createSocket('udp4');
    var buff = new Buffer(message);
    client.send(buff, 0, buff.length, port, Host, function(err, bytes) {
        client.close();
    });
}