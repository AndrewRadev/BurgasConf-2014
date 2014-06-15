window.Controls = function(camera, el) {
  // Player height
  var height = 1.7;

  // Speed of movement
  var speedCoefficient    = 200;
  var slowdownCoefficient = 5;

  // Used for movement calculations;
  var velocity = new THREE.Vector3();

  var moveForward  = null;
  var moveBackward = null;
  var moveLeft     = null;
  var moveRight    = null;

  $el = $(el);

  camera.rotation.set(0, 0, 0);

  var pitch = new THREE.Object3D();
  pitch.add(camera);

  var yaw = new THREE.Object3D();
  yaw.position.y = height;
  yaw.add(pitch);

  // needed for updating movement
  var time     = null;
  var prevTime = performance.now();

  // Listen to events
  $(el).pointerLock({
    on: 'click',
    fullscreenElement: el,
    movement: function(movementX, movementY) {
      updateCamera(movementX, movementY);
    }
  });

  $(document).on('keydown', function(e) {
    switch (e.keyCode) {
      case 87: moveForward  = true; break; // w
      case 65: moveLeft     = true; break; // a
      case 83: moveBackward = true; break; // s
      case 68: moveRight    = true; break; // d

      // case 32: // space
      //   if ( canJump === true ) velocity.y += 350;
      //   canJump = false;
      //   break;
    }
  });

  $(document).on('keyup', function(e) {
    switch (e.keyCode) {
      case 87: moveForward  = false; break; // w
      case 65: moveLeft     = false; break; // a
      case 83: moveBackward = false; break; // s
      case 68: moveRight    = false; break; // d
    }
  });

  // Update camera position based on mouse movement
  var updateCamera = function(movementX, movementY) {
    yaw.rotation.y -= movementX * 0.002;
    pitch.rotation.x -= movementY * 0.002;

    pitch.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch.rotation.x));
  };

  this.getObject = function() {
    return yaw;
  };

  this.update = function() {
    time = performance.now();
    var delta = (time - prevTime) / 1000;
    prevTime = time;

    velocity.x -= velocity.x * slowdownCoefficient * delta;
    velocity.z -= velocity.z * slowdownCoefficient * delta;

    if (moveForward)  { velocity.z -= speedCoefficient * delta; }
    if (moveBackward) { velocity.z += speedCoefficient * delta; }

    if (moveLeft)  { velocity.x -= speedCoefficient * delta; }
    if (moveRight) { velocity.x += speedCoefficient * delta; }

    yaw.translateX(velocity.x * delta);
    // yaw.translateY(velocity.y * delta);
    yaw.translateZ(velocity.z * delta);
  }
};
