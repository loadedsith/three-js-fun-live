'use strict';

angular.module('mysteryProject')  .controller('MainCtrl', function ($scope) {
  $scope.scene = [];
  var noise = new Noise(Math.random());

  var geometry = new THREE.BoxGeometry( 3, 3, 3 );
  var material = new THREE.MeshPhongMaterial( { color: 0xdddddd } )

  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 0, 1 );
  //var cube = new THREE.Mesh( geometry, material );


  var red = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  var green = new THREE.MeshPhongMaterial( { color: 0x445511 } );
  var blue = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
  var purple = new THREE.MeshPhongMaterial( { color: 0xaa00aa } );
  var gold = new THREE.MeshPhongMaterial( {metal:true, color: 0xffd700, specular: 0xffd700, shininess: 100 } );
  
  var redBox = new THREE.Mesh( geometry, red );
  var ground = new THREE.Mesh( geometry, green );
  var goldBox = new THREE.Mesh( geometry, gold );
  var purpleBox = new THREE.Mesh( geometry, purple );

  ground.position.y = -1;

  ground.scale.x = 10;
  ground.scale.y = 0.2;
  ground.scale.z = 10;

  goldBox.position.z = -1;

  goldBox.position.x = -3;

  purpleBox.position.x = 3;

  goldBox.position.z = -1;

  goldBox.position.x = -3;

  $scope.scene.push( ground );
  $scope.scene.push( goldBox );
  $scope.scene.push( purpleBox );


  var lights = [
    {color:0x4040ff}, //001
    {color:0x40ff40}, //010
    {color:0x40ffff}, //011
    {color:0xff4040}, //100
    {color:0xff40ff}, //101
    {color:0xffff00}, //110
    {color:0xffffff}  //111
  ];

  for (var i = lights.length - 1; i >= 0; i--) {
    var spot = new THREE.PointLight( lights[i].color );

    spot.position.z = (Math.random() * 5) - 2.5;
    spot.position.x = (Math.random() * 5) - 2.5;
    spot.position.y = (Math.random() * 5) - 2.5;

    $scope.scene.push( spot );
  }


  $scope.scene.push( light );
  // $scope.scene.push( cube );


  var seedX = Math.random();
  var seedY = Math.random();

  var worldRenderLoop = function () {

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
       

});
