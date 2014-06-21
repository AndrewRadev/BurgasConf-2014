Slides[ 12 ] = {
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
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    var cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = 0.3;
    cube.rotation.y = 0.3;

    scene.add(cube);

    camera.position.z = 5;

    window.render = function() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
  }
};
