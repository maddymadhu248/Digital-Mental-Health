import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ClassroomScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xeff6ff, 0.03);

    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 2.2, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfff0c2, 16, 22);
    sunLight.position.set(-5, 4, 3);
    scene.add(sunLight);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xf7f7f7, roughness: 0.95 })
    );
    floor.position.y = -0.1;
    group.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xeaf4ff, roughness: 0.9, metalness: 0.05 });
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(20, 8, 0.2), wallMaterial);
    wallBack.position.z = -8;
    group.add(wallBack);

    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 8, 16), wallMaterial);
    wallLeft.position.x = -10;
    group.add(wallLeft);

    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 8, 16), wallMaterial);
    wallRight.position.x = 10;
    group.add(wallRight);

    const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x9ed8ff, transparent: true, opacity: 0.72 });
    const windowPane = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.15), windowMaterial);
    windowPane.position.set(-9.4, 3.2, -2.5);
    group.add(windowPane);

    const board = new THREE.Mesh(new THREE.BoxGeometry(7, 2.8, 0.2), new THREE.MeshStandardMaterial({ color: 0x2d3b49 }));
    board.position.set(0, 3.2, -7.8);
    group.add(board);

    const benchGeometry = new THREE.BoxGeometry(2.4, 0.6, 0.9);
    const benchMaterial = new THREE.MeshStandardMaterial({ color: 0xdfefff, roughness: 0.8 });
    for (let i = 0; i < 4; i += 1) {
      const bench = new THREE.Mesh(benchGeometry, benchMaterial);
      bench.position.set(-4 + i * 2.7, 0.8, 2.2);
      group.add(bench);
    }

    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x8fbde8, roughness: 0.7 });
    for (let i = 0; i < 4; i += 1) {
      const desk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 1.1), deskMaterial);
      desk.position.set(-4 + i * 2.7, 1.15, 2.2);
      group.add(desk);
    }

    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0xa9d3ff, roughness: 0.75 });
    for (let i = 0; i < 4; i += 1) {
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.8), chairMaterial);
      chair.position.set(-4 + i * 2.7, 0.7, 2.9);
      group.add(chair);
    }

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y = Math.sin(elapsed * 0.15) * 0.04;
      camera.position.x = Math.sin(elapsed * 0.08) * 0.25;
      camera.lookAt(0, 2, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default ClassroomScene;
