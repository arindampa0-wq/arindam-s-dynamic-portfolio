import { useEffect, useRef } from 'react';

export const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Data pipeline nodes
    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      connections: Node[];

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 3 + 2;
        this.connections = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(var(--primary) / 0.6)';
        ctx.fill();
      }
    }

    // Data packets flowing through pipelines
    class DataPacket {
      from: Node;
      to: Node;
      progress: number;
      speed: number;

      constructor(from: Node, to: Node) {
        this.from = from;
        this.to = to;
        this.progress = 0;
        this.speed = 0.01 + Math.random() * 0.02;
      }

      update() {
        this.progress += this.speed;
        return this.progress >= 1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'hsl(var(--accent) / 0.8)';
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'hsl(var(--accent))';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const nodes: Node[] = [];
    const packets: DataPacket[] = [];
    const nodeCount = 50;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    // Connect nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            node.connections.push(otherNode);
          }
        }
      });
    });

    let packetTimer = 0;

    const animate = () => {
      ctx.fillStyle = 'hsl(var(--background) / 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        
        // Draw connections
        node.connections.forEach(connected => {
          const dx = connected.x - node.x;
          const dy = connected.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connected.x, connected.y);
          ctx.strokeStyle = `hsl(var(--primary) / ${Math.max(0, 0.15 - distance / 1000)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
        
        node.draw(ctx);
      });

      // Create new packets periodically
      packetTimer++;
      if (packetTimer > 30 && nodes.length > 0) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        if (randomNode.connections.length > 0) {
          const randomConnection = randomNode.connections[Math.floor(Math.random() * randomNode.connections.length)];
          packets.push(new DataPacket(randomNode, randomConnection));
          packetTimer = 0;
        }
      }

      // Update and draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const packet = packets[i];
        if (packet.update()) {
          packets.splice(i, 1);
        } else {
          packet.draw(ctx);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-30"
      style={{ pointerEvents: 'none' }}
    />
  );
};
