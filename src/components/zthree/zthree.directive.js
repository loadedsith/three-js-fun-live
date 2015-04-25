'use strict';

angular.module('mysteryProject')
	.directive('zthree', function() {
	  return {
	  	restrict: 'E',
	    template: '<canvas></canvas>',
	    link: function (scope, element, attrs) {
   			console.log('Zthree directive reporting in.');
   			var noise = new Noise(Math.random())
		    var scene = new THREE.Scene();
		    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		    		
		    var renderer = new THREE.WebGLRenderer({canvas:element[0].childNodes[0]});
		    renderer.setSize( window.innerWidth, window.innerHeight );
		    //document.body.appendChild( renderer.domElement );
		    var geometry = new THREE.BoxGeometry( 3, 3, 3 );
		    var material = new THREE.MeshPhongMaterial( { color: 0xdddddd } )

		    var light = new THREE.AmbientLight( 0x404040 );

		    var cube = new THREE.Mesh( geometry, material );

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

		      scene.add( spot );
		    };

		    scene.add( light );
		    scene.add( cube );

		    camera.position.z = 5;
		    var seedX = Math.random();
		    var seedY = Math.random();


		    function render() {
		      
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

		      requestAnimationFrame( render );
		      renderer.render( scene, camera );
		    }
		    render();
	    }
	  };
	});