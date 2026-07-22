'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Atualiza a posição do rato
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Deteta se o rato está em cima de um link ou botão
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Verifica se é um link, botão ou se está dentro de um
      if (target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Esconde o cursor padrão apenas em telas de computador (não afeta telemóveis)
  useEffect(() => {
    document.body.style.cursor = 'none';
    
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      (link as HTMLElement).style.cursor = 'none';
    });

    return () => {
      document.body.style.cursor = 'auto';
      links.forEach(link => {
        (link as HTMLElement).style.cursor = 'pointer';
      });
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-500 pointer-events-none z-[9999] mix-blend-screen flex items-center justify-center hidden md:flex"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 1.5 : 1,
        backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.2)' : 'transparent'
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <div className="w-1 h-1 bg-blue-400 rounded-full" />
    </motion.div>
  );
}