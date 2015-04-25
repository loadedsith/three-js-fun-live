'use strict';

angular.module('mysteryProject')
	.directive('zthree', function() {
	  return {
	  	restrict: 'E',
	  	scope:{
	  		scene:"="
	  	},
	    template: '<canvas></canvas>',
	    link: function (scope, element, attrs) {
   			console.log('Zthree directive reporting in.');
 				var scene = new THREE.Scene();
  			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		    var renderer = new THREE.WebGLRenderer({canvas:element[0].childNodes[0]});
		    renderer.setSize( window.innerWidth - 50, window.innerHeight - 20 );
         camera.position.z = 5;

		    for(var i = 0; i < scope.scene.length; i++){
		    	scene.add(scope.scene[i]);
		    }

		    function render() {
		    	requestAnimationFrame( render );
		      renderer.render( scene, camera );
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