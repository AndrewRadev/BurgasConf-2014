Slides[ 20 ] = {
  init: function($el) {
  },

  run: function($el) {
    var $canvas = $el.find('canvas');

    var scene    = new THREE.Scene();
    var camera   = new THREE.PerspectiveCamera(55, $canvas.innerWidth() / $canvas.innerHeight(), 1, 1000);
    var renderer = new THREE.WebGLRenderer({canvas: $canvas[0], antialias: true});

    renderer.setClearColor(0xffffff);
    renderer.setSize($canvas.innerWidth(), $canvas.innerHeight());

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({
      color:    0x00ff00,
      specular: 0x009900,
      ambient:  0x005500,
      shininess: 10
    });

    var light = new THREE.HemisphereLight(0xaaaaaa, 0x999999);
    scene.add(light);

    var cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.position.z = 5;

    var controls = new THREE.OrbitControls(camera, $canvas[0]);

    window.render = function() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
  }
};
