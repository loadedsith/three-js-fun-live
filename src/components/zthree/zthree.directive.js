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
				var scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
				var camera = scope.camera;
		    var renderer = new THREE.WebGLRenderer({
		    	canvas:element[0].childNodes[0],
	    		antialias: true
		    });

				var gravity = new THREE.Quaternion();
		    renderer.setSize( window.innerWidth - 0, window.innerHeight - 0);
				
				/*
				Apply VR stereo rendering to renderer
				*/
				var effect = new THREE.VREffect( renderer );
				effect.setSize( window.innerWidth, window.innerHeight );
				
				renderer.autoClear = false;
				renderer.setClearColor(0x404040);

				scene.fog = new THREE.Fog(0xcacfde, 0, 10000);

    		var controls = new THREE.VRControls( camera );

				var manager = new WebVRManager(renderer, effect);
			
		    for(var i = 0; i < scope.scene.length; i++){
		    	scene.add(scope.scene[i]);
		    }

				scope.$on('trackGenerated',function(event, track){
    		 scene.add(track);
  			});

				var state;
				var vrHMD;
				var vrHMDSensor;

				navigator.getVRDevices().then(function(vrdevs){
					   for (var i = 0; i < vrdevs.length; ++i) {
       				 if (vrdevs[i] instanceof HMDVRDevice) {
        		    vrHMD = vrdevs[i];
        		    break;
     			    }	
 				    }
				    for (var i = 0; i < vrdevs.length; ++i) {
				        if (vrdevs[i] instanceof PositionSensorVRDevice &&
				            vrdevs[i].hardwareUnitId == vrHMD.hardwareUnitId) {
				            vrHMDSensor = vrdevs[i];
				            break;
				        }
				    }
				});


		    function render() {
		    	if(vrHMDSensor!==undefined){
		    		var orientation = vrHMDSensor.getState().orientation;
		    		gravity.set(
		    			orientation.x,
		    			orientation.y,
		    			orientation.z,
		    			orientation.w
	    			);
		    	}
		    	 if (scope.scene.renderLoop !== undefined) {
		      	if (typeof scope.scene.renderLoop === 'function') {
		      		scope.scene.renderLoop();
		      	}
		      }
					/*
					Update VR headset position and apply to camera.
					*/
					controls.update();
					/*
					Render the scene through the VREffect.
					*/
		    	requestAnimationFrame( render );

		      scene.simulate(); // run physics
		      scope.gravity = new THREE.Euler().setFromQuaternion(gravity, 'XYZ');
		      var max = 15;
		      var offset = 0.0 * max;
					console.log(gravity.x * max - offset)
					scene.setGravity(new THREE.Vector3(
							// gravity.x * max - offset,
							gravity.z * max - offset,//left and right
							-30,
							-1 * (gravity.x * max - offset)
						)
					);


					if (manager.isVRMode()) {
						effect.render(scene, camera);
					} else {
						renderer.render(scene, camera);
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