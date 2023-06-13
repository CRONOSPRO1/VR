import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

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

      const mtlLoader = new MTLLoader();
      mtlLoader.load(
        'assets/poly/poly.mtl',
        function (materials) {
          materials.preload();

          const objLoader = new OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.load(
            'assets/poly/poly.obj',
            function (object) {
              object.scale.set(15,15,15)
              object.position.z = -8;
              scene.add(object);
            },
            undefined,
            function (error) {
              console.error('Error al cargar el archivo OBJ', error);
            }
          );
        },
        undefined,
        function (error) {
          console.error('Error al cargar el archivo MTL', error);
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
