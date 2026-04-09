import React, { useRef, useEffect } from 'react';

const SubtractionCanvas = ({ imageData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (imageData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      ctx.putImageData(imageData, 0, 0);
    }
  }, [imageData]);

  return (
    <div style={containerStyle}>
      <canvas 
        ref={canvasRef} 
        style={{ maxWidth: '100%', borderRadius: '8px', display: 'block' }} 
      />
    </div>
  );
};

const containerStyle = {
  display: 'inline-block',
  position: 'relative',
  padding: '10px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  backgroundColor: '#fff',
  // Checkerboard pattern to show transparency
  backgroundImage: `
    linear-gradient(45deg, #eee 25%, transparent 25%), 
    linear-gradient(-45deg, #eee 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #eee 75%), 
    linear-gradient(-45deg, transparent 75%, #eee 75%)
  `,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
};

export default SubtractionCanvas;
