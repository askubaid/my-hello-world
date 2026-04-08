// import React, { useState, useRef, useEffect } from 'react';
// import DownloadIcon from '@mui/icons-material/Download';

// // --- SUB-COMPONENT: FULLSCREEN MODAL ---
// function FullscreenModal({ imageData, color, onClose }) {
//   const canvasRef = useRef(null);
//   useEffectCanvas(canvasRef, imageData);

//   const handleDownload = (e) => {
//     e.stopPropagation();
//     const link = document.createElement('a');
//     link.download = `cluster-rgb-${color.r}-${color.g}-${color.b}.png`;
//     link.href = canvasRef.current.toDataURL();
//     link.click();
//   };

//   return (
//     <div style={modalOverlayStyle} onClick={onClose}>
//       <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
//         <canvas ref={canvasRef} style={{ maxWidth: '90vw', maxHeight: '70vh', border: `4px solid rgb(${color.r}, ${color.g}, ${color.b})` }} />
//         <h2 style={{ color: 'white' }}>{`RGB: ${color.r}, ${color.g}, ${color.b}`}</h2>
//         <button onClick={handleDownload} style={modalDownloadBtnStyle}>
//           <DownloadIcon style={{ marginRight: '8px' }} /> Download High-Res
//         </button>
//         <p style={{ color: '#aaa', marginTop: '15px', cursor: 'pointer' }} onClick={onClose}>Close</p>
//       </div>
//     </div>
//   );
// }

// // --- SUB-COMPONENT: INDIVIDUAL SEGMENT ---
// function SegmentCard({ imageData, color, label, onClick }) {
//   const canvasRef = useRef(null);
//   useEffectCanvas(canvasRef, imageData);

//   const handleDownload = (e) => {
//     e.stopPropagation(); 
//     const link = document.createElement('a');
//     link.download = `${label}.png`;
//     link.href = canvasRef.current.toDataURL();
//     link.click();
//   };

//   return (
//     <div onClick={onClick} style={cardStyle}>
//       <canvas ref={canvasRef} style={{ maxWidth: '180px', borderRadius: '4px' }} />
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
//         <div style={{ textAlign: 'left' }}>
//           <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{label}</div>
//           <div style={{ fontSize: '0.7em', color: '#666' }}>{`rgb(${color.r},${color.g},${color.b})`}</div>
//         </div>
//         <button onClick={handleDownload} style={iconBtnStyle} title="Download">
//           <DownloadIcon fontSize="small" />
//         </button>
//       </div>
//       <div style={{ width: '100%', height: '6px', backgroundColor: `rgb(${color.r},${color.g},${color.b})`, marginTop: '8px', borderRadius: '2px' }}></div>
//     </div>
//   );
// }

// // Helper hook
// function useEffectCanvas(ref, imageData) {
//   useEffect(() => {
//     if (imageData && ref.current) {
//       const ctx = ref.current.getContext('2d');
//       ref.current.width = imageData.width;
//       ref.current.height = imageData.height;
//       ctx.putImageData(imageData, 0, 0);
//     }
//   }, [imageData, ref]);
// }

// // --- MAIN APP ---
// export default function App() {
//   const [image, setImage] = useState(null);
//   const [kValue, setKValue] = useState(3);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [results, setResults] = useState({ segments: [], colors: [] });
//   const [selectedIdx, setSelectedIdx] = useState(null);
//   const mainCanvasRef = useRef(null);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImage(event.target.result);
//         setResults({ segments: [], colors: [] });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const runKMeans = () => {
//     setIsProcessing(true);
//     setTimeout(() => {
//       const canvas = mainCanvasRef.current;
//       const ctx = canvas.getContext('2d', { willReadFrequently: true });
//       const img = new Image();
//       img.onload = () => {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.drawImage(img, 0, 0);
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const pixels = imageData.data;
//         let data = [];
//         for (let i = 0; i < pixels.length; i += 4) {
//           data.push({ r: pixels[i], g: pixels[i+1], b: pixels[i+2] });
//         }
//         let centroids = [];
//         for (let i = 0; i < kValue; i++) {
//           centroids.push(data[Math.floor(Math.random() * data.length)]);
//         }
//         let assignments = new Array(data.length);
//         for (let iter = 0; iter < 6; iter++) {
//           let clusters = Array.from({ length: kValue }, () => []);
//           data.forEach((pixel, pIdx) => {
//             let bestK = 0, minDist = Infinity;
//             centroids.forEach((c, kIdx) => {
//               const dist = Math.sqrt((pixel.r-c.r)**2 + (pixel.g-c.g)**2 + (pixel.b-c.b)**2);
//               if (dist < minDist) { minDist = dist; bestK = kIdx; }
//             });
//             assignments[pIdx] = bestK;
//             clusters[bestK].push(pixel);
//           });
//           centroids = clusters.map(c => c.length === 0 ? {r:0,g:0,b:0} : {
//             r: Math.round(c.reduce((s, p) => s + p.r, 0) / c.length),
//             g: Math.round(c.reduce((s, p) => s + p.g, 0) / c.length),
//             b: Math.round(c.reduce((s, p) => s + p.b, 0) / c.length),
//           });
//         }
//         const newSegments = [];
//         for (let k = 0; k < kValue; k++) {
//           const segData = new Uint8ClampedArray(pixels.length);
//           for (let i = 0; i < data.length; i++) {
//             const pos = i * 4;
//             if (assignments[i] === k) {
//               segData[pos] = centroids[k].r; segData[pos+1] = centroids[k].g; segData[pos+2] = centroids[k].b; segData[pos+3] = 255;
//             } else { segData[pos+3] = 255; }
//           }
//           newSegments.push(new ImageData(segData, canvas.width, canvas.height));
//         }
//         for (let i = 0; i < data.length; i++) {
//           const k = assignments[i];
//           pixels[i*4] = centroids[k].r; pixels[i*4+1] = centroids[k].g; pixels[i*4+2] = centroids[k].b;
//         }
//         ctx.putImageData(imageData, 0, 0);
//         setResults({ segments: newSegments, colors: centroids });
//         setIsProcessing(false);
//       };
//       img.src = image;
//     }, 100);
//   };

//   return (
//     <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
//       {isProcessing && (
//         <div style={loaderOverlayStyle}>
//           <div className="spinner"></div>
//           <p style={{ color: 'white', marginTop: '15px', fontWeight: 'bold' }}>Processing Segments...</p>
//         </div>
//       )}

//       <h1 style={{ color: '#333', marginBottom: '30px' }}>K-Means Image Segmenter</h1>
      
//       <div style={controlsContainer}>
//         <input type="file" onChange={handleImageUpload} />
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <label style={{ fontWeight: 'bold' }}>K Value:</label>
//           <input type="number" value={kValue} onChange={e => setKValue(Number(e.target.value))} style={inputStyle} />
//         </div>
//         <button onClick={runKMeans} disabled={!image || isProcessing} style={primaryBtnStyle}>
//           Analyze Image
//         </button>
//       </div>

//       <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
//         {image && (
//           <div style={mainCard}>
//             <h4 style={cardTitle}>Original Image</h4>
//             <img src={image} style={{ maxWidth: '400px', borderRadius: '4px' }} alt="Original" />
//           </div>
//         )}
//         <div style={{ ...mainCard, display: results.segments.length > 0 ? 'block' : 'none' }}>
//           <h4 style={cardTitle}>Simplified K-Colors</h4>
//           <canvas ref={mainCanvasRef} style={{ maxWidth: '400px', borderRadius: '4px' }} />
//         </div>
//       </div>

//       {results.segments.length > 0 && (
//         <div>
//           <h3 style={{ marginBottom: '20px' }}>Generated Color Clusters</h3>
//           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
//             {results.segments.map((seg, i) => (
//               <SegmentCard key={i} imageData={seg} color={results.colors[i]} label={`Cluster ${i+1}`} onClick={() => setSelectedIdx(i)} />
//             ))}
//           </div>
//         </div>
//       )}

//       {selectedIdx !== null && (
//         <FullscreenModal imageData={results.segments[selectedIdx]} color={results.colors[selectedIdx]} onClose={() => setSelectedIdx(null)} />
//       )}

//       <style>{`
//         .spinner { border: 5px solid rgba(255, 255, 255, 0.2); border-top: 5px solid #fff; border-radius: 50%; width: 50px; height: 50px; animation: spin 0.8s linear infinite; }
//         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// }

// // --- STYLES ---
// const controlsContainer = { background: 'white', display: 'inline-flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '40px', flexWrap: 'wrap', justifyContent: 'center' };
// const inputStyle = { width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' };
// const primaryBtnStyle = { backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
// const cardStyle = { background: 'white', padding: '15px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 3px 8px rgba(0,0,0,0.1)', width: '210px', transition: 'transform 0.2s' };
// const iconBtnStyle = { background: '#f5f5f5', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', color: '#1976d2' };
// const mainCard = { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' };
// const cardTitle = { margin: '0 0 15px 0', color: '#666', fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' };
// const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 3000 };
// const loaderOverlayStyle = { ...modalOverlayStyle, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 4000 };
// const modalContentStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' };
// const modalDownloadBtnStyle = { marginTop: '20px', backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1em', fontWeight: '500' };

import React, { useState, useRef, useEffect } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import JSZip from 'jszip'; // Import JSZip

// --- SUB-COMPONENT: FULLSCREEN MODAL ---
function FullscreenModal({ imageData, color, onClose }) {
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
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <canvas ref={canvasRef} style={{ maxWidth: '90vw', maxHeight: '70vh', border: `4px solid rgb(${color.r}, ${color.g}, ${color.b})` }} />
        <h2 style={{ color: 'white' }}>{`RGB: ${color.r}, ${color.g}, ${color.b}`}</h2>
        <button onClick={handleDownload} style={modalDownloadBtnStyle}>
          <DownloadIcon style={{ marginRight: '8px' }} /> Download High-Res
        </button>
        <p style={{ color: '#aaa', marginTop: '15px', cursor: 'pointer' }} onClick={onClose}>Close</p>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: INDIVIDUAL SEGMENT ---
function SegmentCard({ imageData, color, label, onClick }) {
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
    <div onClick={onClick} style={cardStyle}>
      <canvas ref={canvasRef} style={{ maxWidth: '180px', borderRadius: '4px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>{label}</div>
          <div style={{ fontSize: '0.7em', color: '#666' }}>{`rgb(${color.r},${color.g},${color.b})`}</div>
        </div>
        <button onClick={handleDownload} style={iconBtnStyle} title="Download">
          <DownloadIcon fontSize="small" />
        </button>
      </div>
      <div style={{ width: '100%', height: '6px', backgroundColor: `rgb(${color.r},${color.g},${color.b})`, marginTop: '8px', borderRadius: '2px' }}></div>
    </div>
  );
}

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

// --- MAIN APP ---
export default function App() {
  const [image, setImage] = useState(null);
  const [kValue, setKValue] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState({ segments: [], colors: [] });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const mainCanvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setResults({ segments: [], colors: [] });
      };
      reader.readAsDataURL(file);
    }
  };

  // ZIP EXPORT LOGIC
  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("K-Means-Export");

    // 1. Original Image (Convert base64 to blob)
    const originalBlob = await fetch(image).then(r => r.blob());
    folder.file("01-original-image.png", originalBlob);

    // 2. Simplified Image
    const simplifiedData = mainCanvasRef.current.toDataURL("image/png").split(',')[1];
    folder.file("02-simplified-output.png", simplifiedData, {base64: true});

    // 3. Individual Segments
    results.segments.forEach((seg, i) => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = seg.width;
      tempCanvas.height = seg.height;
      tempCanvas.getContext('2d').putImageData(seg, 0, 0);
      const data = tempCanvas.toDataURL("image/png").split(',')[1];
      folder.file(`cluster-${i+1}-rgb(${results.colors[i].r},${results.colors[i].g},${results.colors[i].b}).png`, data, {base64: true});
    });

    const content = await zip.generateAsync({type: "blob"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = "kmeans-project-export.zip";
    link.click();
  };

  const runKMeans = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const canvas = mainCanvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let data = [];
        for (let i = 0; i < pixels.length; i += 4) {
          data.push({ r: pixels[i], g: pixels[i+1], b: pixels[i+2] });
        }
        let centroids = [];
        for (let i = 0; i < kValue; i++) {
          centroids.push(data[Math.floor(Math.random() * data.length)]);
        }
        let assignments = new Array(data.length);
        for (let iter = 0; iter < 6; iter++) {
          let clusters = Array.from({ length: kValue }, () => []);
          data.forEach((pixel, pIdx) => {
            let bestK = 0, minDist = Infinity;
            centroids.forEach((c, kIdx) => {
              const dist = Math.sqrt((pixel.r-c.r)**2 + (pixel.g-c.g)**2 + (pixel.b-c.b)**2);
              if (dist < minDist) { minDist = dist; bestK = kIdx; }
            });
            assignments[pIdx] = bestK;
            clusters[bestK].push(pixel);
          });
          centroids = clusters.map(c => c.length === 0 ? {r:0,g:0,b:0} : {
            r: Math.round(c.reduce((s, p) => s + p.r, 0) / c.length),
            g: Math.round(c.reduce((s, p) => s + p.g, 0) / c.length),
            b: Math.round(c.reduce((s, p) => s + p.b, 0) / c.length),
          });
        }
        const newSegments = [];
        for (let k = 0; k < kValue; k++) {
          const segData = new Uint8ClampedArray(pixels.length);
          for (let i = 0; i < data.length; i++) {
            const pos = i * 4;
            if (assignments[i] === k) {
              segData[pos] = centroids[k].r; segData[pos+1] = centroids[k].g; segData[pos+2] = centroids[k].b; segData[pos+3] = 255;
            } else { segData[pos+3] = 255; }
          }
          newSegments.push(new ImageData(segData, canvas.width, canvas.height));
        }
        for (let i = 0; i < data.length; i++) {
          const k = assignments[i];
          pixels[i*4] = centroids[k].r; pixels[i*4+1] = centroids[k].g; pixels[i*4+2] = centroids[k].b;
        }
        ctx.putImageData(imageData, 0, 0);
        setResults({ segments: newSegments, colors: centroids });
        setIsProcessing(false);
      };
      img.src = image;
    }, 100);
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      {isProcessing && (
        <div style={loaderOverlayStyle}>
          <div className="spinner"></div>
          <p style={{ color: 'white', marginTop: '15px', fontWeight: 'bold' }}>Exporting Assets...</p>
        </div>
      )}

      <h1>K-Means Project Visualizer</h1>
      
      <div style={controlsContainer}>
        <input type="file" onChange={handleImageUpload} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold' }}>K Value:</label>
          <input type="number" value={kValue} onChange={e => setKValue(Number(e.target.value))} style={inputStyle} />
        </div>
        <button onClick={runKMeans} disabled={!image || isProcessing} style={primaryBtnStyle}>
          Analyze & Generate
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
        {image && (
          <div style={mainCard}>
            <h4 style={cardTitle}>Original</h4>
            <img src={image} style={{ maxWidth: '400px', borderRadius: '4px' }} alt="Original" />
          </div>
        )}
        <div style={{ ...mainCard, display: results.segments.length > 0 ? 'block' : 'none' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h4 style={cardTitle}>Simplified K-Colors</h4>
                <button onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'simplified-kmeans.png';
                    link.href = mainCanvasRef.current.toDataURL();
                    link.click();
                }} style={iconBtnStyle}><DownloadIcon fontSize="small" /></button>
            </div>
          <canvas ref={mainCanvasRef} style={{ maxWidth: '400px', borderRadius: '4px' }} />
        </div>
      </div>

      {results.segments.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Generated Color Clusters</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {results.segments.map((seg, i) => (
              <SegmentCard key={i} imageData={seg} color={results.colors[i]} label={`Cluster ${i+1}`} onClick={() => setSelectedIdx(i)} />
            ))}
          </div>
          
          {/* SAVE ALL BUTTON */}
          <button onClick={downloadAllAsZip} style={saveAllBtnStyle}>
            <DownloadIcon style={{marginRight: '10px'}} /> Save Project (ZIP)
          </button>
        </div>
      )}

      {selectedIdx !== null && (
        <FullscreenModal imageData={results.segments[selectedIdx]} color={results.colors[selectedIdx]} onClose={() => setSelectedIdx(null)} />
      )}

      <style>{`
        .spinner { border: 5px solid rgba(255, 255, 255, 0.2); border-top: 5px solid #fff; border-radius: 50%; width: 50px; height: 50px; animation: spin 0.8s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// --- STYLES ---
const controlsContainer = { background: 'white', display: 'inline-flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '40px' };
const inputStyle = { width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' };
const primaryBtnStyle = { backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const cardStyle = { background: 'white', padding: '15px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 3px 8px rgba(0,0,0,0.1)', width: '210px' };
const iconBtnStyle = { background: '#f5f5f5', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', color: '#1976d2' };
const mainCard = { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' };
const cardTitle = { margin: '0 0 15px 0', color: '#666', fontSize: '0.8em', textTransform: 'uppercase' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 3000 };
const loaderOverlayStyle = { ...modalOverlayStyle, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 4000 };
const modalContentStyle = { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const modalDownloadBtnStyle = { marginTop: '20px', backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const saveAllBtnStyle = { marginTop: '40px', backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' };
