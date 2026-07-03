import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PdfThumbnail from './PdfThumbnail';

export default function HoverKeyword({ word, pdfUrl }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className="hover-keyword"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        cursor: 'crosshair',
        borderBottom: '1px solid rgba(0,0,0,0.3)',
        transition: 'color 0.3s ease'
      }}
    >
      <span style={{ color: isHovered ? '#000' : 'inherit', fontWeight: isHovered ? 600 : 'inherit' }}>
        {word}
      </span>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '10px',
              width: '240px',
              aspectRatio: '16/9',
              backgroundColor: '#fff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              borderRadius: '6px',
              overflow: 'hidden',
              zIndex: 50,
              pointerEvents: 'none',
              border: '1px solid #eee'
            }}
          >
            <PdfThumbnail file={pdfUrl} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
