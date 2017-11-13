/*jshint esversion: 6*/
class player {
    constructor(number, socket) {
        //$('#messages').text("PLAYER CREATED");
        //console.log('player' + number);
        //console.log('socket' + socket);
        this.number = number;
        this.socket = socket;
        this.socket.forceNew = true;
        this.zt = new ZingTouch.Region(document.body);
        this.initSocket();
        this.getTouchPosition();
        
        //this.getAccelerometer();
    }

    initSocket() {
        var sk = this.socket;
        var n = this.number;
        var zt = this.zt;
        var start = function() {
            sk.emit('start', n);
            document.getElementById('messages').innerText = "";
            zt.unbind(surface, 'tap', start);
        };
        //console.log('connected: ' + n);
        document.getElementById('surface').style.opacity = 1;
        sk.emit('playerconnected', n);
        document.getElementById('messages').innerText = "connected";
        this.socket.on('connect', function() {
        });
        this.socket.on('error', function() {
            document.getElementById('messages').innerText = "error";
            sk.close();
        });
        this.socket.on('close', function() {
            document.getElementById('messages').innerText = "close";
            sk.close();
        });
        this.socket.on('end', function() {
            sk.close();
        });
        this.socket.on('resetclients', function() {
            sk.close();
        });
        this.socket.on('disconnect', function() {
            document.getElementById('messages').innerText = "CONNESSIONE CHIUSA";
            document.getElementById('surface').style.opacity = 0;
            sk.close();
        });
        this.socket.on('goal', function(p) {
            document.getElementById('points').innerText = p.point1 + " : " + p.point2;
            if (n == p.n) {
                document.getElementById('messages').innerText = "TAP TO START";
                zt.bind(surface, 'tap', start);
            } else {
                document.getElementById('messages').innerText = "";
            }
        });
    }

    getTouchPosition() {
        var sk = this.socket;
        var n = this.number;
        var surface = document.getElementById('surface');
        this.zt.bind(surface, 'pan', function(ev) {
            //console.log('pan: ' + ev.detail.events[0].clientY);
            var vy = ev.detail.events[0].clientY / window.innerHeight * 6 - 3;
            if (vy < -3) vy = -3;
            if (vy > 3) vy = 3;
            sk.emit('player', {
                n: n,
                y: -vy
            });
        });
    }


    getAccelerometer() {
        var sk = this.socket;
        var n = this.number;

        if ('Accelerometer' in window && 'Gyroscope' in window) {
            document.getElementById('messages').innerHTML = 'Generic Sensor API';

            let accelerometer = new Accelerometer();
            accelerometer.addEventListener('reading', e => accelerationHandler(accelerometer, 'moAccel'));
            accelerometer.start();

            let accelerometerWithGravity = new Accelerometer({
                includeGravity: true
            });
            accelerometerWithGravity.addEventListener('reading', e => accelerationHandler(accelerometerWithGravity, 'moAccelGrav'));
            accelerometerWithGravity.start();

            let gyroscope = new Gyroscope();
            gyroscope.addEventListener('reading', e => rotationHandler({
                alpha: gyroscope.x,
                beta: gyroscope.y,
                gamma: gyroscope.z
            }));
            gyroscope.start();

            intervalHandler('Not available in Generic Sensor API');

        } else if ('DeviceMotionEvent' in window) {
            document.getElementById('messages').innerHTML = 'Device Motion API';

            var onDeviceMotion = function(eventData) {
                //accelerationHandler(eventData.acceleration, 'messages');
                accelerationHandler(eventData.accelerationIncludingGravity, 'messages');
                //rotationHandler(eventData.rotationRate);
                //intervalHandler(eventData.interval);
            }

            window.addEventListener('devicemotion', onDeviceMotion, false);
        } else {
            document.getElementById('messages').innerHTML = 'No Accelerometer & Gyroscope API available';
        }

        function accelerationHandler(acceleration, targetId) {
            setYPosition(acceleration.y);
            var info, xyz = "[X, Y, Z]";

            info = xyz.replace("X", acceleration.x && acceleration.x.toFixed(3));
            info = info.replace("Y", acceleration.y && acceleration.y.toFixed(3));
            info = info.replace("Z", acceleration.z && acceleration.z.toFixed(3));

            document.getElementById(targetId).innerHTML = info;
        }

        // function rotationHandler(rotation) {
        //     var info, xyz = "[X, Y, Z]";

        //     info = xyz.replace("X", rotation.alpha && rotation.alpha.toFixed(3));
        //     info = info.replace("Y", rotation.beta && rotation.beta.toFixed(3));
        //     info = info.replace("Z", rotation.gamma && rotation.gamma.toFixed(3));
        //     document.getElementById("messages").innerHTML = info;
        // }

        // function intervalHandler(interval) {
        //     document.getElementById("messages").innerHTML = interval;
        // }

        function setYPosition(vy) {
            vy = vy / 10 * 3;
            if (vy < -3) vy = -3;
            if (vy > 3) vy = 3;
            sk.emit('player', {
                n: n,
                y: vy
            });

        }

    }

}