'use strict';

angular.module('mysteryProject')
	.directive('zthree', function() {
	  return {
	  	restrict: 'E',
	  	scope:{
	  		scene:'=',
	  		pose:'='
	  	},
	    template: '<canvas></canvas>',
	    link: function (scope, element, attrs) {
   	    Physijs.scripts.worker = '/app/vendor/physijs_worker.js';
   			console.log('Zthree directive reporting in.');
 				// var scene = new THREE.Scene();
				var scene = new Physijs.Scene;

  			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		    var renderer = new THREE.WebGLRenderer({canvas:element[0].childNodes[0]});
		    renderer.setSize( window.innerWidth - 50, window.innerHeight - 20 );
        
        camera.position.z = 25;
        camera.position.y = 4;

        camera.rotation.x = -0.4;
        
        // var vrrenderer = new THREE.VRRenderer(renderer, vrHMD);

        scope.$on('location', function(event,pose) {
         	camera.rotation.z = pose.z;
         	camera.rotation.x = pose.x;
         	camera.rotation.y = pose.y;
        });

		    for(var i = 0; i < scope.scene.length; i++){
		    	scene.add(scope.scene[i]);
		    }

				scene.setGravity(new THREE.Vector3( 0, -30, 0 ));

		    function render() {
		      scene.simulate(); // run physics

		    	requestAnimationFrame( render );
		      renderer.render( scene, camera );

		      if (scope.pose !== undefined) {
		      	debugger;
		      }

		      if (scope.scene.renderLoop !== undefined) {
		      	if (typeof scope.scene.renderLoop === 'function') {
		      		scope.scene.renderLoop();
		      	}
		      }
		    }
		    render();
	    }
	  };
	});