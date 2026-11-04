import React, {useRef,useEffect} from 'react';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';


export default function Customized3DModel () {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!mountRef.current) return;
  
      // Lấy kích thước container
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
  
      // Khởi tạo Scene
      const scene = new THREE.Scene();
      // Đặt background null để sử dụng renderer.clearColor
      scene.background = null;
  
      // Khởi tạo Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      (camera as any).position.set(0, 2, 5);
  
      // Khởi tạo Renderer với nền trong suốt (alpha: true)
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      const rectLight = new THREE.RectAreaLight(0xffffff, 5, 4, 10);
      rectLight.position.set(0, 5, 0);
      scene.add(rectLight);
      // Đặt clearColor với alpha = 0 (trong suốt)
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);
  
  
      // Thêm ánh sáng
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
      (directionalLight as any).position.set(-1, -2.0, 5);
      scene.add(directionalLight);

      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
      scene.add(hemisphereLight);

      // Thêm OrbitControls để tương tác
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
  
      // Biến lưu AnimationMixer và Clock
      let mixer: THREE.AnimationMixer | null = null;
      const clock = new THREE.Clock();
  
      // Tải model GLTF (bao gồm animation nếu có)
      const loader = new GLTFLoader();
      loader.load(
        "/models/scene.gltf",
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.4, 0.4, 0.4);
          model.position.set(0.5, -1.0, 0);
          model.rotation.y = THREE.MathUtils.degToRad(140);
          model.rotation.x = THREE.MathUtils.degToRad(-10);
          scene.add(model);
          

          // Nếu model có animation, khởi tạo AnimationMixer và chạy với tốc độ 0.25x
          if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            mixer.timeScale = 1;
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
          }

          controls.target.copy(model.position);
          controls.update();
        },
        (xhr) => {
          console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`);
        },
        (error) => {
          console.error("Error loading model:", error);
        }
      );
  
      // Hàm render loop
      const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
  
      // Xử lý resize
      const handleResize = () => {
        const newWidth = mountRef.current!.clientWidth;
        const newHeight = mountRef.current!.clientHeight;
        renderer.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", handleResize);
  
      // Cleanup khi component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    }, []);

    return (
        <div
        className="MODEL 3d"
        ref={mountRef}
        style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100vh" , overflow:"hidden"}}
        />
    )
}