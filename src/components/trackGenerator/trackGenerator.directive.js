'use strict';

angular.module('mysteryProject')
.directive('trackGenerator', function () {
	return {
		templateUrl:'/components/trackGenerator/trackGenerator.html',
		link: function(scope){
			scope.length = 3;//extruded, so ignore

			scope.height = 3;//vertical 

			scope.width = 3;//horizontal

			scope.depth = 1;//notch depth

			scope.generateTrack = function(){
				/*
				2--3   6--7
				|  |   |  |
				|  4---5  |
				|         |
				1---------8
				*/
				var length = scope.length;//extruded, so ignore

				var height = scope.height;//vertical 

				var width = scope.width;//horizontal

				var depth = scope.depth;//notch depth

				var notchWidth = depth;

				var centerWidth = width/2;
				var points = [];

				points.push(new THREE.Vector2( 0, 0));
				points.push(new THREE.Vector2( 0, height));
				points.push(new THREE.Vector2( (centerWidth - notchWidth/2), height));
				points.push(new THREE.Vector2( (centerWidth - notchWidth/2), height - depth));
				points.push(new THREE.Vector2( (centerWidth + notchWidth/2), height - depth));
				points.push(new THREE.Vector2( (centerWidth + notchWidth/2), height));
				points.push(new THREE.Vector2( width,height));
				points.push(new THREE.Vector2( width,0));

				var track = new THREE.Shape(points);

				var geometry = new THREE.ExtrudeGeometry(track,{amount: length});				
				var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );

				var mesh = new THREE.Mesh( geometry, material );
				scope.$broadcast('trackGenerated',mesh);

			}
		}
	}

});