import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    let camera, scene, renderer, vrButton;

    function init() {
      const container = containerRef.current;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        20
      );

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      
        // Mantener la posición de la cámara en un punto fijo
        camera.position.set(0, 0, 0);
      
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
      

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      vrButton = VRButton.createButton(renderer);
      document.body.appendChild(vrButton);

      const loader = new GLTFLoader();
      loader.load(
        'assets/shiba/scene.gltf',
        function (gltf) {
          const model = gltf.scene;
          scene.add(model);
        },
        undefined,
        function (error) {
          console.error('Error al cargar el modelo glTF', error);
        }
      );

      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      renderer.setAnimationLoop(render);
    }

    function render() {
      renderer.render(scene, camera);
    }

    init();
    animate();

    return () => {
      renderer.dispose();
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return <div ref={containerRef} />;
}

export default App;
