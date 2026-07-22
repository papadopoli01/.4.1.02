'use client';

import { useEffect } from 'react';
import * as THREE from 'three';

export function Logo3D() {
  useEffect(() => {
    const container = document.getElementById('logo-3d-container');
    if (!container) return;

    // Limpa o container caso já exista algum canvas anterior
    container.innerHTML = '';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.OctahedronGeometry(1, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x5a189a,
      emissive: 0x10002b,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const logo = new THREE.Mesh(geometry, material);
    scene.add(logo);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x00d2ff, 1.5);
    blueLight.position.set(5, 5, 2);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x7b2cbf, 1.5);
    purpleLight.position.set(-5, -5, 2);
    scene.add(purpleLight);

    camera.position.z = 2.5;

    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      logo.rotation.y += 0.01;
      logo.rotation.x += 0.005;
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      id="logo-3d-container" 
      className="w-10 h-10 cursor-pointer"
      title="Nexora Studios"
    />
  );
}