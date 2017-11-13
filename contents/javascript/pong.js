var BGaudio = new Audio('/contents/audio/Background.mp3');
var ballaudio = new Audio('/contents/audio/Laser.mp3');
var goalaudio = new Audio('/contents/audio/Goal.mp3');
var applauseaudio = new Audio('/contents/audio/Applause.mp3');

window.addEventListener('DOMContentLoaded', function() {

    BGaudio.pause();
    ballaudio.pause();
    goalaudio.pause();
    applauseaudio.pause();

    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);
    var vel = 2;

    var createScene = function() {

        var point1 = 0;
        var point2 = 0;

        var scene = new BABYLON.Scene(engine);
        var wallmaterial = new BABYLON.StandardMaterial('wallmaterial', scene);
        wallmaterial.specularColor = new BABYLON.Color3(1, 1, 1);
        wallmaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        wallmaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

        var gravityVector = new BABYLON.Vector3(0, 0, 0);
        var physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, -12), scene);
        camera.setTarget(BABYLON.Vector3.Zero());

        var light = new BABYLON.PointLight('light1', new BABYLON.Vector3(0, 0, -1000), scene);

        var halfrow = BABYLON.Mesh.CreatePlane('middlerow', 0.1, scene);
        halfrow.scaling.y = 80;
        halfrow.material = wallmaterial;

        var ball = BABYLON.Mesh.CreateSphere('sphere1', 8, 0.4, scene);
        ball.material = new BABYLON.StandardMaterial('spherematerial', scene);
        ball.material.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0);
        ball.material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0);
        ball.material.specularColor = new BABYLON.Color3(1, 1, 0);
        ball.position.y = 0;

        var floor = BABYLON.Mesh.CreateBox('floor', 200, scene);
        floor.position.z = 0.5;
        floor.scaling.z = 0.00001;
        floor.material = new BABYLON.StandardMaterial('floor', scene);
        floor.material.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        floor.material.specularColor = new BABYLON.Color3(0, 0, 0);

        var box1 = BABYLON.Mesh.CreateBox('box1', 0.2, scene);
        box1.scaling.y = 9.5;
        box1.scaling.z = 4;
        box1.position.x = -6;
        box1.position.z = 0;
        box1.material = new BABYLON.StandardMaterial('box1mat', scene);
        box1.material.diffuseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
        box1.material.emissiveColor = new BABYLON.Color3(1.0, 0.766, 0.336);
        box1.material.specularColor = new BABYLON.Color3(1.0, 0.766, 0.336);

        var box2 = BABYLON.Mesh.CreateBox('box2', 0.2, scene);
        box2.scaling.y = 9.5;
        box2.scaling.z = 4;
        box2.position.x = 6;
        box2.position.z = 0;
        box2.material = new BABYLON.StandardMaterial('box1mat', scene);
        box2.material.diffuseColor = new BABYLON.Color3(0.0, 0.766, 1.0);
        box2.material.emissiveColor = new BABYLON.Color3(0.0, 0.766, 1.0);
        box2.material.specularColor = new BABYLON.Color3(0.0, 0.766, 1.0);

        var goal1 = BABYLON.Mesh.CreateBox('goal1', 0.1, scene);
        var goal2 = BABYLON.Mesh.CreateBox('goal2', 0.1, scene);
        goal1.scaling.y = 80.55;
        goal2.scaling.y = 80.55;
        goal1.position.x = -7.5;
        goal2.position.x = 7.5;
        goal1.material = wallmaterial;
        goal2.material = wallmaterial;

        //////////////////////////////////////////////////
        var widthCanvas = 800,
            heightCanvas = 800;
        var widthMesh = 4,
            heightMesh = 2;
        //////////////////////////////////////////////////
        var textTitle = new BABYLON.DynamicTexture("textTitle", { width: widthCanvas, height: heightCanvas }, scene, true);
        textTitle.drawText("00 00", null, null, "Bold 380px Consolas", "rgba(255,255,255,1.0)", "rgba(0,0,0,0)"); // "transparent"
        textTitle.update();
        var titleMat = new BABYLON.StandardMaterial("titleMat", scene);
        titleMat.diffuseTexture = textTitle;
        titleMat.diffuseTexture.hasAlpha = true;
        titleMat.emissiveColor = BABYLON.Color3.White();
        ////////////////////////////////////////////////// 
        var titleMesh = BABYLON.Mesh.CreatePlane("title", widthMesh, scene);
        titleMesh.material = titleMat;
        ////////////////////////////////////////////////// 

        var wall1 = BABYLON.Mesh.CreatePlane('wall1', 0.1, scene);
        wall1.scaling.x = 150.0;
        wall1.position.y = 4;
        wall1.material = wallmaterial;

        var wall2 = BABYLON.Mesh.CreatePlane('wall2', 0.1, scene);
        wall2.scaling.x = 150.0;
        wall2.position.y = -4;
        wall2.material = wallmaterial;

        scene.collisionsEnabled = true;
        box1.checkCollisions = true;
        box2.checkCollisions = true;
        ball.checkCollisions = true;
        wall1.checkCollisions = true;
        wall2.checkCollisions = true;
        goal1.checkCollisions = true;
        goal2.checkCollisions = true;
        box1.physicsImpostor = new BABYLON.PhysicsImpostor(box1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1, move: false });
        box2.physicsImpostor = new BABYLON.PhysicsImpostor(box2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1, move: false });
        ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 1 });
        wall1.physicsImpostor = new BABYLON.PhysicsImpostor(wall1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1, move: false });
        wall2.physicsImpostor = new BABYLON.PhysicsImpostor(wall2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1, move: false });
        goal1.physicsImpostor = new BABYLON.PhysicsImpostor(goal1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, move: false });
        goal2.physicsImpostor = new BABYLON.PhysicsImpostor(goal2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0, move: false });
        goal1.physicsImpostor.physicsBody.collisionResponse = false;
        goal2.physicsImpostor.physicsBody.collisionResponse = false;

        ball.physicsImpostor.registerOnPhysicsCollide(box1.physicsImpostor, function(coll, collagnst) {
            setVelocity(ball, box1, coll, vel);
        });
        ball.physicsImpostor.registerOnPhysicsCollide(box2.physicsImpostor, function(coll, collagnst) {
            setVelocity(ball, box2, coll, -vel);
        });
        ball.physicsImpostor.registerOnPhysicsCollide(goal1.physicsImpostor, function(coll, collagnst) {
            point2++;
            updatePoints(2);
        });
        ball.physicsImpostor.registerOnPhysicsCollide(goal2.physicsImpostor, function(coll, collagnst) {
            point1++;
            updatePoints(1);
        });

        var updatePoints = function(n) {
            vel = 2;
            if ((n == 1 && point1 > 0) || (n == 2 && point2 > 0)) {
                playApplause();
                playAudioGoal();
            }
            textTitle.getContext().clearRect(0, 0, window.innerWidth, window.innerHeight);
            textTitle.drawText(format(point1) + " " + format(point2), null, null, "Bold 380px Consolas", "rgba(255,255,255,1.0)", "rgba(0,0,0,0)"); // "transparent"
            if (n == -1) return;
            socket.emit('goal', { n: n, point1: point1, point2: point2 });
        };

        var setVelocity = function(obj1, obj2, imp1, vx) {
            playAudioBall();
            vel = vel > 6 ? 6 : vel + 0.08;
            var vy = (obj1.position.y - obj2.position.y) * 1.5;
            vx = vx * (1 + Math.abs(obj1.position.y - obj2.position.y));
            imp1.setLinearVelocity(new BABYLON.Vector3(vx, vy, 0));
        };

        //////////////////////////////////////////////////////////////////////////////////////

        var reset = function() {
            ball.position.x = 0;
            ball.position.y = 0;
            box1.position.y = 0;
            box2.position.y = 0;
            point1 = 0;
            point2 = 0;
            ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
            updatePoints(-1);
            BGaudio.pause();
        };

        socket.on('player', function(obj) {
            if (obj.n == 1)
                box1.position.y = obj.y;
            if (obj.n == 2)
                box2.position.y = obj.y;
        });

        socket.on('start', function(n) {
            ball.position.x = n == 1 ? box1.position.x + 0.1 : box2.position.x - 0.1;
            ball.position.y = n == 1 ? box1.position.y : box2.position.y;
            ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(n == 1 ? vel : -vel, 0, 0));
        });

        socket.on('showqr', function(n) {
            $('#player' + n).show();
            $('#photo' + n).hide();
            reset();
        });
        reset();
        return scene;
    };

    function playAudioBall() {
        ballaudio.currentTime = 0;
        ballaudio.play();
    }

    function playAudioGoal() {
        goalaudio.currentTime = 0;
        goalaudio.play();
    }

    function playApplause() {
        applauseaudio.currentTime = 0;
        applauseaudio.play();
    }

    var scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });

    function format(val) {
        return ("0" + val).slice(-2);
    }

    socket.on('hideqr', function(n) {
        $('#player' + n).hide();
        $('#photo' + n).show();
    });

    socket.on('user-photo', function(data) {
        $('#photo' + data.n).css({
            'background': 'url(' + data.url + ')',
            'background-size': 'contain',
            'background-position': 'center',
            'background-repeat': 'no-repeat'
        });
    });

    socket.on('ready', function() {
        BGaudio.currentTime = 0;
        BGaudio.play();
    });

    socket.on('connect', function() {
        socket.emit('resetclients');
    });

    BGaudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

});