'use strict';

angular.module('mysteryProject')  .controller('MainCtrl', function ($scope) {
  $scope.scene = [];
  var noise = new Noise(Math.random());

  var geometry = new THREE.BoxGeometry( 3, 3, 3 );
  var material = new THREE.MeshPhongMaterial( { color: 0xdddddd } )

  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 0, 1 );
  $scope.scene.push( light );

  //var cube = new THREE.Mesh( geometry, material );


  var red = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  var green = new THREE.MeshPhongMaterial( { color: 0x445511 } );
  var blue = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
  var purple = new THREE.MeshPhongMaterial( { color: 0xaa00aa } );
  var gold = new THREE.MeshPhongMaterial( {metal:true, color: 0xffd700, specular: 0xffd700, shininess: 100 } );
  
  var ground = new Physijs.BoxMesh( geometry, red, 0);

  ground.position.y = -8;
  ground.scale.x = 20;
  ground.scale.y = 2;
  ground.scale.z = 20;
  var x = ground.rotation.x - 0.1;
  var y = ground.rotation.y;
  var z = ground.rotation.z;
  ground.rotation.set(x, y, z);
  ground.receiveShadow = true;
  ground.castShadow = true;
  $scope.scene.push( ground );

  var wallXMax = new Physijs.BoxMesh( geometry, green, 0);
  wallXMax.position.y = -12;
  wallXMax.position.x = -9;
  wallXMax.position.z = -19;
  wallXMax.receiveShadow = true;
  wallXMax.castShadow = true;
  wallXMax.scale.x = 20;
  wallXMax.scale.y = 6;
  wallXMax.scale.z = 1;
  $scope.scene.push( wallXMax );

  var wallXMin = new Physijs.BoxMesh( geometry, purple, 0);
  wallXMin.position.y = -12;
  wallXMin.position.x = -9;
  wallXMin.position.z = 19;
  wallXMin.receiveShadow = true;
  wallXMin.castShadow = true;
  wallXMin.scale.x = 20;
  wallXMin.scale.y = 6;
  wallXMin.scale.z = 1;
  $scope.scene.push( wallXMin );


  var goldBox = new THREE.Mesh( geometry, gold );
  goldBox.position.x = -1;
  goldBox.position.y = -13;
  goldBox.position.z = 3;
  $scope.scene.push( goldBox );


  var purpleBox = new THREE.Mesh( geometry, purple );
  purpleBox.position.x = 3;
  purpleBox.position.y = -1;
  purpleBox.position.z = -13;
  $scope.scene.push( purpleBox );



  var sphere = new Physijs.SphereMesh(
    new THREE.SphereGeometry(5),
    red
  );
  
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
      }
    }, //011
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
  


  var worldRenderLoop = function () {
    var seedX = Math.random();
    var seedY = Math.random();
    for (var i = 0; i <  $scope.flies.length; i++){
      var light =  $scope.flies[i].spot;
      var mesh =  $scope.flies[i].mesh;
      var max = 10;
      light.position.x = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.x)) - (max/2);
      light.position.y = max + (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.y)) - (max/2);
      light.position.z = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.z)) - (max/2);
      mesh.position.x = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.x)) - (max/2);
      mesh.position.y = max + (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.y)) - (max/2);
      mesh.position.z = (max * noise.perlin2(Date.now() / 1000, lights[i].seeds.z)) - (max/2);
    }

    

  }

  var cubeRenderLoop = function () {

    var rotX = Math.abs(
      noise.perlin2(
        Date.now() / 1000000,
        seedX
      )
    );
    var rotY = Math.abs(
      noise.perlin2(
        Date.now() / 1000000,
        seedY
      )
    );

    cube.rotation.x = rotX * 360;
    cube.rotation.y = rotY * 360;
  };
         
  $scope.scene.renderLoop = cubeRenderLoop;
  $scope.scene.renderLoop = worldRenderLoop;
       

  var socket = io('http://localhost:3001');

  socket.on('location', function(pose) {
    $scope.pose = pose;
    console.log(pose)
    $scope.$broadcast('location',pose);
  });

});
