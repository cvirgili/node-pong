/*jshint esversion: 6*/
var interval, ypos = 0.0;
class player {
    constructor(number, socket) {
        this.number = number;
        this.socket = socket;
        this.socket.forceNew = true;
        this.zt = new ZingTouch.Region(document.body);
        this.getYPosition = function(ev) {
            ypos = ev.detail.events[0].pageY / document.getElementById('surface').clientHeight * -20 + 10;
            if (ypos < -3) ypos = -3;
            if (ypos > 3) ypos = 3;
            //console.log("event", ev);
            return ypos;
        };
        this.initSocket();
        this.getTouchPosition();
        this.start;
        this.startSendY = function() {
            interval = setInterval(function() {
                socket.emit('player' + number, ypos);
            }, 60);
        }
        this.stopSendY = function() {
            clearInterval(interval);
        }
    }

    initSocket() {
        var sk = this.socket;
        var n = this.number;
        var zt = this.zt;
        var isStart = false;
        this.start = function(ev) {
            if (isStart) {
                sk.emit('start', n);
                isStart = false;
            }
            document.getElementById('messages').innerText = "";
        };
        document.getElementById('surface').style.opacity = 1;
        sk.emit('playerconnected', n);
        document.getElementById('messages').innerText = "connected";
        this.socket.on('connect', function() {});
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
                isStart = true;
            } else {
                document.getElementById('messages').innerText = "";
            }
        });

    }

    getTouchPosition() {
        var surface = document.getElementById('surface');
        this.zt.bind(surface, 'tap', this.start);
        this.zt.bind(surface, 'pan', this.getYPosition);
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