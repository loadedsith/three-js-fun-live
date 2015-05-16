'use strict';
angular.module('mysteryProject')  .controller('MainCtrl', function ($scope) {
  $scope.scene = [];

  $scope.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.001, 100 );
  $scope.gravity = new THREE.Vector3( 0, -30, 0 );
  $scope.camera.position.set(0,10,15)

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
      y: groundLevel,
      z: 0
    },
    scale:{
      x: 200,
      y: 2,
      z: 200
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
  sphere.position.z = -14;
  sphere.receiveShadow = true;
  sphere.castShadow = true;

  $scope.scene.push( sphere );


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


  // $scope.scene.push( cube );

  $scope.flies = $scope.makeFlies();
  
  document.addEventListener("keydown", keyDownTextField, false);
 

  $scope.camera.rotation.x = -0.4;
  $scope.lat = -180;
  $scope.lon = 0;
  
  $scope.x=0;
  $scope.y=-30;
  $scope.z=0;

  function keyDownTextField(e) {
    // $scope.camera.rotation.x += 0.01; 
    var weight = 5;
    if(e.keyCode === 87){
      //w
      if (e.shiftKey) {
        $scope.up();
      }else{
        $scope.upGravity();
      }
    }
    if(e.keyCode === 83){
      //s
      if (e.shiftKey) {
        $scope.down();
      }else{
        $scope.downGravity();
      }
    }
    if(e.keyCode === 68){
      //d
      if (e.shiftKey) {
        $scope.right();
      }else{
        $scope.rightGravity();
      }
    }
    if(e.keyCode === 65){
      //a
      if (e.shiftKey) {
        $scope.left();
      }else{
        $scope.leftGravity();
      }
    }
    if(e.keyCode === 69){
      //e OK
      // $scope.y += weight;
    }
    if(e.keyCode === 81){
      // $scope.y -= weight;
    }

    if(e.keyCode === 37){
      // $scope.y -= weight;
      $scope.leftPosition();
    }
    if(e.keyCode === 38){
      // $scope.y -= weight;
      $scope.upPosition();

    }
    if(e.keyCode === 39){
      // $scope.y -= weight;
      $scope.rightPosition();

    }
    if(e.keyCode === 40){
      // $scope.y -= weight;
      $scope.downPosition();

    }


    // var g = latLonToXYZ($scope.lat, $scope.lon, 10.0)
    
    $scope.gravity.set($scope.x, $scope.y, $scope.z);
    
    gravityArrow.rotation.set($scope.x/360+180, $scope.y/360+180, $scope.z/360+90)
    sphere.__dirtyPosition = true;
    console.log($scope.gravity);

    // var r = latLonToXYZ($scope.lat, $scope.lon, 10);
    // gravityArrow.lookAt(r)
    // var keyCode = e.keyCode;
  }

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
    // var seedX = Math.random();
    // var seedY = Math.random();
    // for (var i = 0; i <  $scope.flies.length; i++){
    //   var light =  $scope.flies[i].spot;
    //   var mesh =  $scope.flies[i].mesh;
    //   var max = 10;
    //   light.position.x = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.x)) - (max/2);
    //   light.position.y = max + (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.y)) - (max/2);
    //   light.position.z = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.z)) - (max/2);
    //   mesh.position.x = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.x)) - (max/2);
    //   mesh.position.y = max + (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.y)) - (max/2);
    //   mesh.position.z = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.z)) - (max/2);
    // }
  }

  $scope.up = function(){
    $scope.camera.rotation.x += 0.05;
  };
  $scope.down = function(){
    $scope.camera.rotation.x -= 0.05;
  };
  $scope.left = function(){
    $scope.camera.rotation.y += 0.1;
  };
  $scope.right = function(){
    $scope.camera.rotation.y -= 0.1 ;
  };

  $scope.upGravity = function(){
    $scope.y += 0.05;
  };
  $scope.downGravity = function(){
    $scope.y -= 0.05;
  };
  $scope.rightGravity = function(){
    $scope.x += 0.1;
  };
  $scope.leftGravity = function(){
    $scope.x -= 0.1;
  };

  $scope.upPosition = function(){
    $scope.camera.position.y  += 0.1;
  };
  $scope.downPosition = function(){
    $scope.camera.position.y  -= 0.1 ;
  };
  $scope.leftPosition = function(){
    $scope.camera.position.x  -= 0.1;
  };
  $scope.rightPosition = function(){
    $scope.camera.position.x  += 0.1;
  };

  $scope.$on('trackGenerated',function(event, track){
    // track.position.set(10,0,0)
    $scope.scene.push(track);
  });

  $scope.scene.renderLoop = worldRenderLoop;

});
