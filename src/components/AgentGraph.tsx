import React, { useEffect, useState, useMemo } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export const AgentGraph = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize nodes
  useEffect(() => {
    const width = window.innerWidth;
    const height = 800; // Limit height to hero area
    setDimensions({ width, height });

    // Significantly reduce density to avoid "dirt" look
    // Was width / 40, now width / 150 for much fewer, cleaner nodes
    const nodeCount = Math.min(Math.floor(width / 150), 15);
    
    const initialNodes = Array.from({ length: nodeCount }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3, // Slower movement
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 3, // Larger nodes (3px to 5px) to look like "hubs" not dust
    }));
    setNodes(initialNodes);
  }, []);

  // Animation loop
  useEffect(() => {
    if (nodes.length === 0) return;

    let animationFrameId: number;

    const update = () => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          let nx = node.x + node.vx;
          let ny = node.y + node.vy;

          // Bounce off edges
          if (nx < 0 || nx > dimensions.width) node.vx *= -1;
          if (ny < 0 || ny > dimensions.height) node.vy *= -1;

          return { ...node, x: nx, y: ny };
        })
      );
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  // Calculate connections
  const connections = useMemo(() => {
    const lines: { id: string; x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    const maxDistance = 250; // Increased connection distance since nodes are further apart

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          lines.push({
            id: `${nodes[i].id}-${nodes[j].id}`,
            x1: nodes[i].x,
            y1: nodes[i].y,
            x2: nodes[j].x,
            y2: nodes[j].y,
            // Subtler lines
            opacity: (1 - distance / maxDistance) * 0.5,
          });
        }
      }
    }
    return lines;
  }, [nodes]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="w-full h-full">
        {/* Connections */}
        {connections.map((line) => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            className="text-primary/20 dark:text-primary/30"
            strokeWidth="1.5"
            style={{ opacity: line.opacity }}
          />
        ))}

        {/* Nodes - using circle with distinct stroke to look clean */}
        {nodes.map((node) => (
          <g key={node.id}>
             {/* Glow effect */}
             <circle
              cx={node.x}
              cy={node.y}
              r={node.size * 2}
              className="text-primary/10 fill-current"
            />
            {/* Core */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              className="text-primary/40 dark:text-primary/60 fill-current"
            />
          </g>
        ))}
        
        {/* Decorative accent nodes (Amber) - fewer of them */}
        {nodes.filter((_, i) => i % 4 === 0).map((node) => (
           <circle
            key={`accent-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.size}
            className="text-accent/60 fill-current"
          />
        ))}
      </svg>
    </div>
  );
};