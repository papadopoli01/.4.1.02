'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const width = container.clientWidth || 40;
    const height = container.clientHeight || 40;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.OctahedronGeometry(1, 0);
    
    // Material com a cor principal e brilhante do tema do site (Cyan/Azul Nexora)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x00d2ff,       
      emissive: 0x002244,    
      roughness: 0.1,        
      metalness: 0.9,        
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const logo = new THREE.Mesh(geometry, material);
    scene.add(logo);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x0077ff, 3);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-10 h-10 cursor-pointer flex items-center justify-center overflow-hidden"
      title="Nexora Studios"
    />
  );
}