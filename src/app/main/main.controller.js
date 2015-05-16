'use strict';
angular.module('mysteryProject')  .controller('MainCtrl', function ($scope) {
  $scope.scene = [];

  $scope.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.001, 100 );
  $scope.gravity = new THREE.Vector3( 0, -30, 0 );
  $scope.camera.position.set(0,10,50);

  var noise = new Noise(Math.random());

  var geometry = new THREE.BoxGeometry( 3, 3, 3 );
  var material = new THREE.MeshPhongMaterial( { color: 0xdddddd } )

  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 0, 1 );
  $scope.scene.push( light );

  var red = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  var green = new THREE.MeshPhongMaterial( { color: 0x445511 } );
  var blue = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
  var purple = new THREE.MeshPhongMaterial( { color: 0xaa00aa } );
  var gold = new THREE.MeshPhongMaterial( {metal:true, color: 0xffd700, specular: 0xffd700, shininess: 100 } );
  

  var buildWall = function(config, scene){
    var geometry = config.geometry||new THREE.BoxGeometry( 3, 3, 3 );
    var color = config.color||new THREE.MeshPhongMaterial( { color: 0xff0000 } );
    var wall = new Physijs.BoxMesh(geometry, color , 0);

    wall.position.y = config.position.y || 0;
    wall.position.x = config.position.x || 0;
    wall.position.z = config.position.z || 0

    wall.receiveShadow = config.receiveShadow || true;
    wall.castShadow = config.castShadow || true;

    wall.renderDepth = 1;

    wall.scale.x = config.scale.x || 1;
    wall.scale.y = config.scale.y || 1;
    wall.scale.z = config.scale.z || 1;

    scene.push( wall );
  };

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

  var walls = [
    forward,
    backward,
    left,
    right,
    ground
  ];

  for (var i = walls.length - 1; i >= 0; i--) {
      buildWall(walls[i], $scope.scene);
  };


  var gravityArrow = new THREE.Mesh(  new THREE.CylinderGeometry( 1, 1, 10, 12 ), purple );

  $scope.scene.push( gravityArrow );

  var sphere = new Physijs.SphereMesh(
    new THREE.SphereGeometry(5,32, 32),
    red
  );

  // sphere.add($scope.camera);
  sphere.position.z = -14;
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  sphere.__dirtyPosition = true;

  $scope.scene.push( sphere );

  var sphere2 = new Physijs.SphereMesh(
    new THREE.SphereGeometry(5,32, 32),
    red
  );
  
  sphere2.position.z = 14;
  sphere2.__dirtyPosition = true;
  $scope.scene.push( sphere2 );

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
  
  $scope.makeFlies = function() {
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
      flies.push({spot:spot, mesh: mesh});
      $scope.scene.push( spot );
      $scope.scene.push( mesh );
    }
    return flies;
  }

  $scope.flies = $scope.makeFlies();
  
  $scope.camera.rotation.x = -0.4;
  $scope.lat = -180;
  $scope.lon = 0;
  
  $scope.x=0;
  $scope.y=-30;
  $scope.z=0;

  var latLonToXYZ = function(lat, lon, max) {
    var r =  Math.PI / 180.0
    var cosLat = Math.cos(lat * r);
    var sinLat = Math.sin(lat * r);
    var cosLon = Math.cos(lon * r);
    var sinLon = Math.sin(lon * r);

    var rad = max;
    var marker = new THREE.Vector3();
    marker.x = rad * cosLat * cosLon;
    marker.y = rad * cosLat * sinLon;
    marker.z = rad * sinLat;
    return marker;
  }

  var worldRenderLoop = function () {
    sphere.__dirtyPosition = true;
    sphere2.applyCentralImpulse(new THREE.Vector3(0, 0, -200));
    sphere2.__dirtyPosition = true;
  
    var seedX = Math.random();
    var seedY = Math.random();
    for (var i = 0; i <  $scope.flies.length; i++){
      var light =  $scope.flies[i].spot;
      var mesh =  $scope.flies[i].mesh;
      var max = 60;
      light.position.x = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.x)) - (max/2);
      light.position.y = max + (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.y)) - (max/2);
      light.position.z = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.z)) - (max/2);
      mesh.position.x = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.x)) - (max/2);
      mesh.position.y = max + (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.y)) - (max/2);
      mesh.position.z = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.z)) - (max/2);
    }
  }

 

  $scope.$on('trackGenerated',function(event, track){
    // track.position.set(10,0,0)
    $scope.scene.push(track);
  });

  $scope.scene.renderLoop = worldRenderLoop;

});
