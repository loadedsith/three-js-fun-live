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
      getHMDVRDevice:function(vrdevs) {
        for (var i = 0; i < vrdevs.length; ++i) {
          if (vrdevs[i] instanceof HMDVRDevice) {
            return vrdevs[i];
          }
        }
      },
      getHMDSensor:function(vrdevs, vrHMD) {
        for (var i = 0; i < vrdevs.length; ++i) {
          var isPositionSensor = vrdevs[i] instanceof PositionSensorVRDevice;
          var sameDevice = vrdevs[i].hardwareUnitId === vrHMD.hardwareUnitId;
          if (isPositionSensor && sameDevice) {
            return vrdevs[i];
          }
        }

      },
      link: function(scope, element) {
        Physijs.scripts.worker = '/vendor/physijs_worker.js';
        Physijs.scripts.ammo = '/vendor/ammo.js';

        var scene = new Physijs.Scene({fixedTimeStep: 1 / 120});

        scene.addEventListener(
          'update',
          function() {
            scene.simulate(undefined, 1);
          }
        );

        var camera = scope.camera;
        var renderer = new THREE.WebGLRenderer({
          canvas:element[0].childNodes[0],
          antialias: true
        });

        var gravity = new THREE.Quaternion();
        renderer.setSize(window.innerWidth - 0, window.innerHeight - 0);

        /*
        Apply VR stereo rendering to renderer
        */
        var effect = new THREE.VREffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);

        renderer.autoClear = false;
        renderer.setClearColor(0x404040);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        var controls = new THREE.VRControls(camera);

        var manager = new WebVRManager(renderer, effect);

        for (var i = 0; i < scope.scene.length; i++) {
          scene.add(scope.scene[i]);
        }

        scope.$on('trackGenerated', function(event, track) {
          scene.add(track);
        });

        var vrHMD;
        var vrHMDSensor;
        if (navigator.getVRDevices !== undefined) {
          navigator.getVRDevices().then(function(vrdevs) {
            vrHMD = this.getHMDVRDevice(vrdevs);
            vrHMDSensor = this.getHMDSensor(vrdevs, vrHMD);
          });
        }

        scene.setGravity(new THREE.Vector3(0, -30, 0));

        function render() {
          if (vrHMDSensor !== undefined) {
            var orientation = vrHMDSensor.getState().orientation;
            if (orientation !== undefined && orientation !== null) {
              gravity.set(
                orientation.x,
                orientation.y,
                orientation.z,
                orientation.w
              );
              scope.gravity = new THREE.Euler();
              scope.gravity.setFromQuaternion(gravity, 'XYZ');
              var max = 15;
              var offset = 0.0 * max;
              scene.setGravity(new THREE.Vector3(
                gravity.z * max - offset, //left and right
                -30,
                -1 * (gravity.x * max - offset)//Fore and back
              ));
            }
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
          requestAnimationFrame(render);

          if (manager.isVRMode()) {
            effect.render(scene, camera);
          } else {
            renderer.render(scene, camera);
          }

          scene.simulate(); // run physics
        }

        render();
        /*
        Listen for double click event to enter full-screen VR mode
        */
        document.body.addEventListener('dblclick', function() {
          effect.setFullScreen(true);
        });

        /*
        Listen for keyboard event and zero positional sensor on appropriate keypress.
        */
        function onkey(event) {
          event.preventDefault();

          if (event.keyCode === 90) {// z
            controls.zeroSensor();
          }
        }

        window.addEventListener('keydown', onkey, true);
        /*
        Handle window resizes
        */
        function onWindowResize() {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          effect.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', onWindowResize, false);

      }
    };
  });
