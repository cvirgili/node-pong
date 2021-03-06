var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ejs = require('ejs');
//var ip = require('ip');
const ni = require('network-interfaces');
var favicon = require('serve-favicon');
var PORT = 3000;
const settings = require(__dirname + '/settings.json');
var ipoptions = { interval: false, ipVersion: 4 };
var address;
try { address = ni.toIp(settings.ethernetname, ipoptions); } catch (e) { address = ni.toIp(ni.getInterfaces(ipoptions)[0], ipoptions); };
var clients = [];
var playersObj = { y1: 0, y2: 0 };

app.use('/contents', express.static(__dirname + '/contents'));
app.use('/modules', express.static(__dirname + '/node_modules'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/pong', function(req, res) {
    res.render('pong', { ip: address, port: PORT });
});

app.get('/player1', function(req, res) {
    res.render('player', { ip: address, number: 1 });
});

app.get('/player2', function(req, res) {
    res.render('player', { ip: address, number: 2 });
});

io.on('connect', function(socket) {
    socket.on('error', function() {});
    socket.on('disconnect', function(data) {
        for (var i in clients) {
            if (clients[i].sk == socket) {
                io.emit('showqr', clients[i].n);
                clients.splice(i, 1);
            }
        }
        io.emit('disconnect');
        socket.disconnect();
    });
    socket.on('close', function(data) {});
    socket.on('end', function(data) {});
    socket.on('player', function(n, y) {
        //######################################################
        playersObj["y" + n] = y;
        //console.log(playersObj)
        // io.emit("players-control", playersObj);
        // if (obj.n == 1)
        //     io.emit('player1', obj.y);
        // if (obj.n == 2)
        //     io.emit('player2', obj.y);
        //######################################################

    });

    // socket.on('player1', (y) => {
    //     io.emit('player1', y);
    // });
    // socket.on('player2', (y) => {
    //     io.emit('player2', y);
    // });

    socket.on('resetclients', function() {
        io.sockets.emit('resetclients');
    });
    socket.on('goal', function(obj) {
        io.sockets.emit('goal', obj);
    });
    socket.on('start', function(obj) {
        io.emit('start', obj);
    });
    socket.on('user-photo', function(obj) {
        io.emit('user-photo', obj);
    });

    socket.on('playerconnected', function(n) {
        var cl = { sk: socket, n: n };
        if (clients.indexOf(cl) == -1 && clients.length < 2) {
            clients.push(cl);
            io.emit('hideqr', n);
        } else {
            socket.disconnect();
        }
        if (clients.length == 2) {
            io.sockets.emit('goal', { n: 1, point1: 0, point2: 0 });
            io.sockets.emit('ready');
        }
    });
});

http.listen(PORT, address, function() {
    console.log('app listening on', address, ':', PORT);

    setInterval(() => {
        io.emit("players-control", playersObj);
    }, 40);

    //console.log("address", address);
});