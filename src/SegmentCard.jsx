import React, { useState, useRef, useEffect } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import JSZip from 'jszip'; // Import JSZip
import styles from './styles.jsx';

// --- SUB-COMPONENT: FULLSCREEN MODAL ---


const SegmentCard= ({ imageData, color, label, onClick })=>  {
  const canvasRef = useRef(null);
  useEffectCanvas(canvasRef, imageData);

  const handleDownload = (e) => {
    e.stopPropagation(); 
    const link = document.createElement('a');
    link.download = `${label}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div onClick={onClick} style={styles.cardStyle}>
        {/* Wrap canvas in the checkerboard div */}
      <div style={styles.checkerboardBackground}>
        <canvas ref={canvasRef} style={{ maxWidth: '180px', borderRadius: '4px' }} />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{label}</div>
          <div style={{ fontSize: '0.7em', color: '#666' }}>{`rgb(${color.r},${color.g},${color.b})`}</div>
        </div>
        <button onClick={handleDownload} style={styles.iconBtnStyle} title="Download">
          <DownloadIcon fontSize="small" />
        </button>
      </div>
      <div style={{ width: '100%', height: '6px', backgroundColor: `rgb(${color.r},${color.g},${color.b})`, marginTop: '8px', borderRadius: '2px' }}></div>
    </div>
  );
}


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

export default SegmentCard