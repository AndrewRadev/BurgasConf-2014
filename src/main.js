$(function() {
  $canvas = $('canvas');

  var scene    = new THREE.Scene();
  var camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  var renderer = new THREE.WebGLRenderer({canvas: $canvas[0], antialias: true});

  axisHelper = new THREE.AxisHelper(100);
  scene.add(axisHelper);

  scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  renderer.setClearColor( 0xffffff );
  renderer.setSize(window.innerWidth, window.innerHeight);

  var floor = addFloor(scene);
  var cube = addCube(scene);

  cube.position.set(0, 0, 0);

  camera.position.x = 10;
  camera.position.y = 10;
  camera.position.z = 10;
  camera.lookAt(cube.position);

  // var controls = new THREE.PointerLockControls(camera, renderer.domElement);
  // scene.add( controls.getObject() );

  addLights(scene);

  function render() {
    requestAnimationFrame(render);

    // cube.rotation.x += 0.1;
    // cube.rotation.y += 0.1;

    // controls.update();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  render();
});

function addCube(scene) {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  // var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
  var cube     = new THREE.Mesh(geometry, material);

  scene.add(cube);
  return cube;
}

function addFloor(scene) {
  geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

  for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
    var vertex = geometry.vertices[ i ];
    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;
  }

  for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
    var face = geometry.faces[ i ];
    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  }
  material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
  // material = new THREE.MeshBasicMaterial( { color: 'blue' } );

  mesh = new THREE.Mesh( geometry, material );
  mesh.position.y = 0;
  // scene.add(debugPosition(mesh.position));

  scene.add( mesh );
  return mesh;
}

function addLights(scene) {
  var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
  light.position.set( 1, 1, -1 );
  scene.add( light );
  scene.add( new THREE.DirectionalLightHelper(light, 1) );

  var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
  light.position.set( -1, -0.5, -1 );
  scene.add( light );
  scene.add( new THREE.DirectionalLightHelper(light, 1) );
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
