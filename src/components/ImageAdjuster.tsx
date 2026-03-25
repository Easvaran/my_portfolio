'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Maximize2 } from 'lucide-react';

interface ImageAdjusterProps {
  imageSrc: string;
  onConfirm: (base64: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // 1 for square, 0.75 for 3:4 etc.
  circular?: boolean;
}

const ImageAdjuster = ({ 
  imageSrc, 
  onConfirm, 
  onCancel, 
  aspectRatio = 1,
  circular = true 
}: ImageAdjusterProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize image
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      // Reset values when new image loaded
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleConfirm = () => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high quality output size
    const size = 1000;
    canvas.width = size;
    canvas.height = size / aspectRatio;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save state
    ctx.save();
    
    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply transformations
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    
    // Calculate image draw position
    // We need to translate the offset from UI coordinates to canvas coordinates
    // This is a simplified version
    const uiScale = 300 / size; // Assuming UI container is 300px
    ctx.translate(offset.x / uiScale / zoom, offset.y / uiScale / zoom);

    // Draw image centered
    const img = imgRef.current;
    const iw = img.width;
    const ih = img.height;
    const scale = Math.max(canvas.width / iw, canvas.height / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    
    ctx.restore();
    
    onConfirm(canvas.toDataURL('image/webp', 0.8));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-card border border-white/10 rounded-[48px] overflow-hidden p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-white uppercase tracking-widest">Adjust Image</h3>
          <button onClick={onCancel} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Preview Area */}
        <div 
          ref={containerRef}
          className="relative aspect-square w-full max-w-[300px] mx-auto bg-black rounded-3xl overflow-hidden cursor-move touch-none border-2 border-primary/20"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Grid Overlay */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-20">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/50" />
            ))}
          </div>

          {/* Mask */}
          {circular && (
            <div className="absolute inset-0 pointer-events-none z-20 border-[40px] border-black/60 rounded-full" />
          )}

          {/* Image */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {imageSrc && (
              <img 
                src={imageSrc} 
                alt="Adjust" 
                className="max-w-none h-full w-full object-cover pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 space-y-6">
          <div className="flex items-center gap-4">
            <ZoomOut size={18} className="text-muted-foreground" />
            <input 
              type="range" 
              min="0.5" 
              max="3" 
              step="0.01" 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-grow h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
            />
            <ZoomIn size={18} className="text-muted-foreground" />
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setRotation(r => r - 90)}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5"
              title="Rotate Left"
            >
              <RotateCw size={20} className="scale-x-[-1]" />
            </button>
            <button 
              onClick={() => setRotation(r => r + 90)}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5"
              title="Rotate Right"
            >
              <RotateCw size={20} />
            </button>
            <button 
              onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); setRotation(0); }}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5"
              title="Reset"
            >
              <Maximize2 size={20} />
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="flex-grow py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-grow py-5 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              <Check size={20} />
              <span>Apply</span>
            </button>
          </div>
        </div>

        {/* Hidden Canvas for output */}
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
};

export default React.memo(ImageAdjuster);
