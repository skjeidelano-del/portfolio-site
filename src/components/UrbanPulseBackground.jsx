import React, { useRef, useEffect } from 'react';

export default function UrbanPulseBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: null, y: null };
    const maxMouseDist = 250; 
    const maxNodeDist = 120;
    const numNodes = Math.floor((width * height) / 8000); // Higher density node count

    let nodes = [];

    // Initialize random fluid nodes
    function initNodes() {
      nodes = [];
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4, // Slow drift velocity X
          vy: (Math.random() - 0.5) * 0.4, // Slow drift velocity Y
          radius: Math.random() * 1.5 + 0.5
        });
      }
    }
    
    initNodes();

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initNodes();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseLeave);
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId;
    function render() {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];

        // Fluid movement
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls smoothly
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Interaction with mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxMouseDist) {
            // Draw line to mouse
            const opacity = 1 - (dist / maxMouseDist);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.4})`; // reduced from 0.6
            ctx.lineWidth = 1.0; // reduced from 1.5
            ctx.stroke();

            // Slight magnetic repel or attract (let's do slight repel for fluid feeling)
            const force = (maxMouseDist - dist) / maxMouseDist;
            node.x -= (dx / dist) * force * 1.5; // Stronger repel
            node.y -= (dy / dist) * force * 1.5;
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();

        // Check connections with other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          let otherNode = nodes[j];
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxNodeDist) {
            const opacity = 1 - (dist / maxNodeDist);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.25})`; // make node-to-node lines slightly more visible
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, 
        pointerEvents: 'none', 
      }}
    />
  );
}
