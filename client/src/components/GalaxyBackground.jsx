import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GalaxyBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.035);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 1800; i += 1) {
      const radius = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      starPositions.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xe0e0e0, size: 0.05, transparent: true, opacity: 0.95 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const spiralPoints = [];
    for (let i = 0; i < 800; i += 1) {
      const t = i / 70;
      const radius = 0.08 + i * 0.008;
      const x = Math.cos(t) * radius;
      const y = (i - 400) * 0.003;
      const z = Math.sin(t) * radius;
      spiralPoints.push(new THREE.Vector3(x, y, z));
    }
    const spiralGeometry = new THREE.BufferGeometry().setFromPoints(spiralPoints);
    const spiralMaterial = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.8 });
    const spiral = new THREE.Line(spiralGeometry, spiralMaterial);
    group.add(spiral);

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = [];
    const particleColors = [];
    for (let i = 0; i < 140; i += 1) {
      const radius = Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      particlePositions.push(Math.cos(theta) * radius, Math.sin(theta) * radius * 0.45, Math.sin(theta) * radius * 0.3);
      const color = i % 2 === 0 ? 0xff4ecd : 0x5d3fd3;
      particleColors.push((color >> 16 & 255) / 255, (color >> 8 & 255) / 255, (color & 255) / 255);
    }
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
    const particleMaterial = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.95 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x5d3fd3, transparent: true, opacity: 0.18 })
    );
    group.add(glow);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y = elapsed * 0.18;
      particles.rotation.z = elapsed * 0.12;
      stars.rotation.y = -elapsed * 0.04;
      glow.rotation.y += 0.004;
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

export default GalaxyBackground;
