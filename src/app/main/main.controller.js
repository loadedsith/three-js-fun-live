'use strict';
angular.module('mysteryProject')  .controller('MainCtrl', function ($scope) {
  $scope.scene = [];

  $scope.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  $scope.gravity = new THREE.Vector3( 0, -30, 0 );
  $scope.camera.position.set(0,10,15)

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
  ground.position.z = -8;
  ground.scale.x = 20;
  ground.scale.y = 2;
  ground.scale.z = 20;
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
  wallXMax.scale.y = 16;
  wallXMax.scale.z = 1;
  $scope.scene.push( wallXMax );

  var wallXMin = new Physijs.BoxMesh( geometry, purple, 0);
  wallXMin.position.y = -12;
  wallXMin.position.x = -9;
  wallXMin.position.z = 19;
  wallXMin.receiveShadow = true;
  wallXMin.castShadow = true;
  wallXMin.scale.x = 20;
  wallXMin.scale.y = 16;
  wallXMin.scale.z = 1;
  $scope.scene.push( wallXMin );

  var wallYMax = new Physijs.BoxMesh( geometry, green, 0);
  wallYMax.position.y = -12;
  wallYMax.position.x = 19;
  wallYMax.position.z = 9;
  wallYMax.receiveShadow = true;
  wallYMax.castShadow = true;
  wallYMax.scale.x = 1;
  wallYMax.scale.y = 16;
  wallYMax.scale.z = 20;
  $scope.scene.push( wallYMax );

  var wallYMin = new Physijs.BoxMesh( geometry, purple, 0);
  wallYMin.position.y = -12;
  wallYMin.position.x = -19;
  wallYMin.position.z = 9;
  wallYMin.receiveShadow = true;
  wallYMin.castShadow = true;
  wallYMin.scale.x = 1;
  wallYMin.scale.y = 16;
  wallYMin.scale.z = 20;
  $scope.scene.push( wallYMin );


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

  $scope.$on('trackGenerated',function(){
    console.log('trackGenerated Event Recieved');
  });


  $scope.scene.renderLoop = cubeRenderLoop;
  $scope.scene.renderLoop = worldRenderLoop;

});
