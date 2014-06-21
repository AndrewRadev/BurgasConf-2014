$(function() {
  $canvas = $('canvas');

  var scene    = new THREE.Scene();
  var camera   = new THREE.PerspectiveCamera(55, $canvas.innerWidth() / $canvas.innerHeight(), 1, 1000);
  var renderer = new THREE.WebGLRenderer({canvas: $canvas[0], antialias: true});

  // axisHelper = new THREE.AxisHelper(100);
  // scene.add(axisHelper);

  scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  renderer.setClearColor( 0xffffff );
  renderer.setSize(window.innerWidth, window.innerHeight);

  addFloor(scene);
  //TODO don't make this global
  window.cubes = addCubes(scene);

  var controls = new Controls(camera, renderer.domElement);
  scene.add(controls.getObject());

  // var controls = new THREE.PointerLockControls(camera, renderer.domElement);
  // scene.add( controls.getObject() );

  addLights(scene);

  function render() {
    requestAnimationFrame(render);

    // cube.rotation.x += 0.1;
    // cube.rotation.y += 0.1;

    controls.update();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  render();
});

function addCubes(scene) {
  var side = 3;
  var cubes = [];

  for (var i = 0; i < 20; i++) {
    var geometry = new THREE.BoxGeometry(side, side, side);
    var material = new THREE.MeshPhongMaterial({
      color:    0x00ff00,
      specular: 0x009900,
      ambient:  0x111111,
    });

    var cube = new THREE.Mesh(geometry, material);

    var randomX = -50 + Math.random()*100;
    var randomZ = -50 + Math.random()*100;

    cube.position.set(randomX, side / 2, randomZ);
    cube.rotation.y = -Math.PI/2 + Math.random()*Math.PI

    cubes.push(cube);
    scene.add(cube);
  }

  return cubes;
}

function addFloor(scene) {
  var segments = 10;
  var geometry = new THREE.PlaneGeometry( 100, 100, segments, segments );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

  var materialEven = new THREE.MeshBasicMaterial({ color: 0xccccfc });
  var materialOdd  = new THREE.MeshBasicMaterial({ color: 0x444464 });
  var materials    = [materialEven, materialOdd];

  for (var x = 0; x < segments; x++) {
    for (var y = 0; y < segments; y++) {
      i = x * segments + y
      j = 2 * i

      geometry.faces[j].materialIndex     = (x + y) % 2;
      geometry.faces[j + 1].materialIndex = (x + y) % 2;
    }
  }

  var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

  mesh.position.y = 0;
  scene.add( mesh );
}

function addLights(scene) {
  // var light = new THREE.HemisphereLight(0x999999, 0x999999);
  // scene.add(light);

  var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
  light.position.set( 1, 1, -1 );
  scene.add( light );
  // scene.add( new THREE.DirectionalLightHelper(light, 1) );

  var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
  light.position.set( -1, -0.5, -1 );
  scene.add( light );
  // scene.add( new THREE.DirectionalLightHelper(light, 1) );
}

// Debugging

function debugPosition(position) {
  return debugSphere(1, position, 'red');
}

function debugBbox(mesh) {
  mesh.geometry.computeBoundingBox();

  var min = mesh.geometry.boundingBox.min;
  var max = mesh.geometry.boundingBox.max;

  console.log(min, max);

  var geometry = new THREE.BoxGeometry(
    Math.abs(max.x - min.x),
    Math.abs(max.y - min.y),
    Math.abs(max.z - min.z)
  );
  var material = new THREE.MeshLambertMaterial({
    color: 'red',
    transparent: true,
    opacity: 0.5
  });
  var box = new THREE.Mesh(geometry, material);
  box.position = mesh.position;
  return box;
}

function debugBsphere(mesh) {
  mesh.geometry.computeBoundingSphere();
  return debugSphere(mesh.geometry.boundingSphere.radius, mesh.position, 'red');
}

// For debugging purposes
function debugSphere(radius, position, color) {
  var geometry, material, mesh;
  geometry = new THREE.SphereGeometry(radius, 32, 32);
  material = new THREE.MeshLambertMaterial({
    color: color,
    transparent: true,
    opacity: 0.5
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position = position;
  return mesh;
};
