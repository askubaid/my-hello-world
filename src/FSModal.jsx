import React, { useState, useRef, useEffect } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import styles from './styles.jsx';

// --- SUB-COMPONENT: FULLSCREEN MODAL ---  

// Helper hook
function useEffectCanvas(ref, imageData) {
  useEffect(() => {
    if (imageData && ref.current) {
      const ctx = ref.current.getContext('2d');
      ref.current.width = imageData.width;
      ref.current.height = imageData.height;
      ctx.putImageData(imageData, 0, 0);
    }
  }, [imageData, ref]);
}


export default function FullscreenModal ({ imageData, color, onClose}) {
  const canvasRef = useRef(null);
  useEffectCanvas(canvasRef, imageData);

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.download = `cluster-rgb-${color.r}-${color.g}-${color.b}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };


  return (
    <div style={styles.modalOverlayStyle} onClick={onClose}>
      <div style={styles.modalContentStyle} onClick={(e) => e.stopPropagation()}>

        <div style={{ ...styles.checkerboardBackground, border: `4px solid rgb(${color.r}, ${color.g}, ${color.b})` }}>
     
        <canvas ref={canvasRef} style={{ maxWidth: '90vw', maxHeight: '70vh', border: `4px solid rgb(${color.r}, ${color.g}, ${color.b})` }} />
         </div>
        <h2 style={{ color: 'white' }}>{`RGB: ${color.r}, ${color.g}, ${color.b}`}</h2>
        <button onClick={handleDownload} style={styles.modalDownloadBtnStyle}>
          <DownloadIcon style={{ marginRight: '8px' }} /> Download High-Res
        </button>
        <p style={{ color: '#aaa', marginTop: '15px', cursor: 'pointer' }} onClick={onClose}>Close</p>
      </div>
    </div>
  );
}