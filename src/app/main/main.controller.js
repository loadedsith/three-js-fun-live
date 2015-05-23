'use strict';
angular.module('mysteryProject')  .controller('MainCtrl', function ($scope) {
  $scope.scene = [];

  $scope.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 100 );
  $scope.camera.position.set(0,10,50);

  var noise = new Noise(Math.random());

  var geometry = new THREE.CubeGeometry( 3, 3, 3 );
  
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 0, 1 );
  $scope.scene.push( light );

  var red = new THREE.MeshPhongMaterial( { color: 0xff0000 });
  var green = new THREE.MeshPhongMaterial( { color: 0x445511 });
  var gold = new THREE.MeshPhongMaterial( {metal:true, color: 0xffd700, specular: 0xffd700, shininess: 100 } );
  

  var buildWall = function(config, scene){
    var geometry = config.geometry||new THREE.CubeGeometry( 3, 3, 3 );
    var color = config.color||new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    var wall = new Physijs.BoxMesh(geometry, color , 0);

    wall.position.y = config.position.y || 0;
    wall.position.x = config.position.x || 0;
    wall.position.z = config.position.z || 0;

    wall.receiveShadow = config.receiveShadow || true;
    wall.castShadow = config.castShadow || true;

    wall.renderDepth = 1;

    wall.scale.x = config.scale.x || 1;
    wall.scale.y = config.scale.y || 1;
    wall.scale.z = config.scale.z || 1;

    scene.push( wall );
  };

  $scope.makeWalls = function(){
      
    var groundLevel = -20;
    var wallLength = 27;

    var ground = {
      color: green,
      geometery: geometry,
      position:{
        x: 0,
        y: groundLevel-18,
        z: 0
      },
      scale:{
        x: 40,
        y: 1,
        z: 40
      }
    };

    var forward = {
      color:green,
      position:{
        x:0,
        y:groundLevel,
        z:-40
      },
      scale:{
        x:wallLength,
        y:10,
        z:1
      }
    };

    var backward = {
      color:green,
      position:{
        x:0,
        y:groundLevel,
        z:40
      },
      scale:{
        x:wallLength,
        y:10,
        z:1
      }
    };


    var right = {
      position: {
        x: 40,
        y: groundLevel,
        z: 0
      },
      scale: {
        x: 1,
        y: 10,
        z: wallLength
      }
    };

    var left = {
      color: gold,
      position: {
        x: -40,
        y: groundLevel,
        z: 0
      },
      scale: {
        x: 1,
        y: 10,
        z: wallLength
      }
    };

    var divider = {
      position: {
        x: 10,
        y: groundLevel,
        z: 0
      },
      scale: {
        x: wallLength/2,
        y: 10,
        z: 1
      }
    };

    var walls = [
      forward,
      backward,
      left,
      // divider,
      right,
      ground
    ];

    for (var i = walls.length - 1; i >= 0; i--) {
        buildWall(walls[i], $scope.scene);
    }
  };
  $scope.makeWalls();


  //KEYS
  function keyDownTextField(e) {
    if(e.keyCode === 87){
      //w
      sphere.applyCentralImpulse(new THREE.Vector3(0, 0, -200));
    }
    if(e.keyCode === 83){
      //s
      sphere.applyCentralImpulse(new THREE.Vector3(0, 0, 200));
    }
    if(e.keyCode === 65){
      //a
      sphere.applyCentralImpulse(new THREE.Vector3(-200, 0, 0));
    }

    if(e.keyCode === 68){
      //d
      sphere.applyCentralImpulse(new THREE.Vector3(200, 0, 0));

    }
  }
  document.addEventListener('keydown', keyDownTextField, false);

  
  $scope.createSphere = function(){
    //sphere.add($scope.camera);
    var sphere = new Physijs.SphereMesh(
      new THREE.SphereGeometry(5,16, 16),
      green
    );

    sphere.position.z = -14;
    sphere.receiveShadow = true;
    sphere.castShadow = true;
    sphere.collisions = 0;
    sphere.__dirtyPosition = true;
    return sphere; 
  };
  var sphere = $scope.createSphere();
  $scope.scene.push( sphere );

  var goal = new Physijs.BoxMesh(
    new THREE.CubeGeometry(5,5,5),
    red
  );

  goal.position.z = 14;
  goal.position.y = -14;
  goal.receiveShadow = true;
  goal.castShadow = true;

  var goalCollison = function(collidedWith, linearVelocity, angularVelocity) {
    if (collidedWith.uuid === sphere.uuid) {
      alert('you win.');
    }
    console.log('collidedWith, linearVelocity, angularVelocity',collidedWith, linearVelocity, angularVelocity);
  };

  var goalReady = function(){
    console.log('Goal Ready');
  };
  



  goal.addEventListener( 'collision', goalCollison );
  goal.addEventListener( 'ready', goalReady );

  goal.collisions = 1;

  $scope.scene.push( goal );

  var lights = [
    {
      color:0x4040ff,
      seeds: {
       x:Math.random(),
       y:Math.random(),
       z:Math.random()
      }
    }, //001
    {
      color:0x40ff40,
      seeds: {
       x:Math.random(),
       y:Math.random(),
       z:Math.random()
      }
    }, //010
    {
      color:0x40ffff,
      seeds: {
       x:Math.random(),
       y:Math.random(),
       z:Math.random()
      
}    }, //011
    {
      color:0xff4040,
      seeds: {
       x:Math.random(),
       y:Math.random(),
       z:Math.random()
      }
    }, //100
    {
      color:0xff40ff,
      seeds: {
       x:Math.random(),
       y:Math.random(),
       z:Math.random()
      }
    }, //101
    {
      color:0xffff00,
      seeds: {
       x:Math.random(),
       y:Math.random(),
       z:Math.random()
      }
    }, //110
    {
      color:0xffffff,
      seeds: {
       x:Math.random(),
       y:Math.random(),
       z:Math.random()
      }
    }  //111
  ];
  
  $scope.makeFlies = function(lights) {
    var flies = [];

    for (var i = lights.length - 1; i >= 0; i--) {
      var spot = new THREE.PointLight( lights[i].color );
      spot.position.z = (Math.random() * 5) - 2.5;
      spot.position.x = (Math.random() * 5) - 2.5;
      spot.position.y = (Math.random() * 5) - 2.5;

      var mesh = new THREE.Mesh( geometry, red );
      mesh.scale.x = 0.2;
      mesh.scale.y = 0.2;
      mesh.scale.z = 0.2;
      flies.push({spot:spot, mesh: mesh, color:lights[i].color, seeds:lights[i].seeds});
      $scope.scene.push( spot );
      $scope.scene.push( mesh );
    }
    return flies;
  };

  $scope.flies = $scope.makeFlies(lights);

  $scope.camera.rotation.x = -0.4;
  $scope.lat = -180;
  $scope.lon = 0;
  
  $scope.x = 0;
  $scope.y = -30;
  $scope.z = 0;


  var worldRenderLoop = function () {
    var fliesOffset = new THREE.Vector3(0,500,50);

    sphere.__dirtyPosition = true;
    for (var i = 0; i <  $scope.flies.length; i++){
      var light =  $scope.flies[i].spot;
      var mesh =  $scope.flies[i].mesh;
      var max = 1000;
      var now = Date.now();
      var seeds = $scope.flies[i].seeds;

      var x = (max * noise.perlin2(now / 1000, seeds.x)) - (max/2);
      light.position.x = x;
      mesh.position.x = x;

      var y = max + (max * noise.perlin2(now / 1000, seeds.y)) - (max/2);
      light.position.y = y;
      mesh.position.y = y;
      
      var z = (max * noise.perlin2(now / 1000, seeds.z)) - (max/2);
      light.position.z = z;
      mesh.position.z = z;

    }
  };

 

  $scope.$on('trackGenerated',function(event, track){
    // track.position.set(10,0,0)
    $scope.scene.push(track);
  });

  $scope.scene.renderLoop = worldRenderLoop;


});
