'use strict';

angular.module('mysteryProject')
	.directive('zthree', function() {
	  return {
	  	restrict: 'E',
	  	scope:{
	  		scene:'=',
	  		pose:'=',	
	  		camera:'=',	
	  		gravity:'='
	  	},
	    template: '<canvas></canvas>',
	    link: function (scope, element, attrs) {
   	    Physijs.scripts.worker = '/app/vendor/physijs_worker.js';
   			console.log('Zthree directive reporting in.');
 				// var scene = new THREE.Scene();
				var scene = new Physijs.Scene;
				var camera = scope.camera;
		    var renderer = new THREE.WebGLRenderer({canvas:element[0].childNodes[0]});
		    renderer.setSize( window.innerWidth - 50, window.innerHeight - 20 );
        
        // var vrrenderer = new THREE.VRRenderer(renderer, vrHMD);

        scope.$on('location', function(event,pose) {
         	camera.rotation.z = pose.z;
         	camera.rotation.x = pose.x;
         	camera.rotation.y = pose.y;
        });

		    for(var i = 0; i < scope.scene.length; i++){
		    	scene.add(scope.scene[i]);
		    }

				scene.setGravity(scope.gravity);

				

		    function render() {
		      scene.simulate(); // run physics

					scene.setGravity(scope.gravity);

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