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
   	    Physijs.scripts.worker = '/vendor/physijs_worker.js';
   			console.log('Zthree directive reporting in.');
 				// var scene = new THREE.Scene();
				var scene = new Physijs.Scene;
				var camera = scope.camera;
		    var renderer = new THREE.WebGLRenderer({canvas:element[0].childNodes[0]});
		    renderer.setSize( window.innerWidth - 0, window.innerHeight - 0);

    		var controls = new THREE.VRControls( camera );

				/*
				Apply VR stereo rendering to renderer
				*/
				var effect = new THREE.VREffect( renderer );
				effect.setSize( window.innerWidth, window.innerHeight );

        scope.$on('location', function(event,pose) {
         	camera.rotation.z = pose.z;
         	camera.rotation.x = pose.x;
         	camera.rotation.y = pose.y;
        });

		    for(var i = 0; i < scope.scene.length; i++){
		    	scene.add(scope.scene[i]);
		    }

				scene.setGravity(scope.gravity);

				scope.$on('trackGenerated',function(event, track){
    		 scene.add(track);
    		 console.log('doit')
  			});

		    function render() {

					/*
					Update VR headset position and apply to camera.
					*/
					controls.update();

					/*
					Render the scene through the VREffect.
					*/
					effect.render( scene, camera );

		      scene.simulate(); // run physics

					scene.setGravity(scope.gravity);



		    	requestAnimationFrame( render );
		      //renderer.render( scene, camera );

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


				/*
				Listen for double click event to enter full-screen VR mode
				*/
				document.body.addEventListener( 'dblclick', function() {
					effect.setFullScreen( true );
				});

				/*
				Listen for keyboard event and zero positional sensor on appropriate keypress.
				*/
				function onkey(event) {
			    event.preventDefault();

			    if (event.keyCode == 90) { // z
			    	controls.zeroSensor();
			    }
			  };

			  window.addEventListener("keydown", onkey, true);



				/*
				Handle window resizes
				*/
				function onWindowResize() {
					camera.aspect = window.innerWidth / window.innerHeight;
					camera.updateProjectionMatrix();

					effect.setSize( window.innerWidth, window.innerHeight );
				}

				window.addEventListener( 'resize', onWindowResize, false );

	    }
	  };
	});