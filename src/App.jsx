import React, { useState, useRef, useEffect } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import JSZip, { file } from 'jszip'; // Import JSZip
import styles from './styles.jsx';
import SegmentCard from './SegmentCard.jsx';
import runKMeans from './KMeans.jsx';
import FullscreenModal from './FSModal.jsx';
import downloadAllAsZip from './DownloadAllZip.jsx';
import Spinner from './Spinner.jsx';
import Header from './Header.jsx';
import SubtractionCanvas from './SubtractionCanvas.jsx';




// --- MAIN APP ---
export default function App() {
  const [image, setImage] = useState(null);
  const [kValue, setKValue] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  //const [results, setResults] = useState({ segments: [], colors: [] });
  const [selectedIdx, setSelectedIdx] = useState(null);
  const mainCanvasRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [viewing, setViewing] = useState(null);
  

  const [selectedItem, setSelectedItem] = useState(null);
  
  const [subtractionResult, setSubtractionResult] = useState(null);
  const [subtractedIndex, setSubtractedIndex] = useState(null);


  // In App.jsx
  const [results, setResults] = useState({ segments: [], colors: [], iterations: 0 });


  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFileName(file.name)
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setImage(event.target.result);
  //       setResults({ segments: [], colors: [] });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      // Clear ALL old results
      setResults({ segments: [], originalSegments: [], colors: [], iterations: 0, assignments: [] });
      setSubtractionResult(null); 
      setSubtractedIndex(null);
    };
    reader.readAsDataURL(file);
  }
};



const handleSubtraction = (index) => {
  setIsProcessing(true); // Start Spinner
  setSubtractedIndex(index);
  
  setTimeout(() => { // Small timeout to let UI render the spinner
    const img = new Image();
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = imageData.data;

      results.assignments.forEach((clusterIdx, i) => {
        if (clusterIdx === index) {
          pixels[i * 4 + 3] = 0; 
        }
      });

      setSubtractionResult(new ImageData(pixels, tempCanvas.width, tempCanvas.height));
      setIsProcessing(false); // Stop Spinner
    };
    img.src = image;
  }, 50);
}

const downloadSubtraction = () => {
  if (!subtractionResult) return;
  const canvas = document.createElement('canvas');
  canvas.width = subtractionResult.width;
  canvas.height = subtractionResult.height;
  canvas.getContext('2d').putImageData(subtractionResult, 0, 0);
  
  const link = document.createElement('a');
  link.download = `subtracted-cluster-${subtractedIndex + 1}.png`;
  link.href = canvas.toDataURL();
  link.click();
}
  
  return (
    <div style={{justifyContent: 'center', fieldwrap: 'wrap', minHeight: '100vh'} }> 
    <Header/>
    <div style={{ textAlign: 'center', padding: '5px 20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      { isProcessing && ( <Spinner/> )  }

     <h1>K-Means Visualization </h1>
      
      {/* Showing control Container */}

    <div style={styles.controlsContainer}>
      {/* Group 1: File Upload */}
        <div style={styles.inputGroup}>
                
          {/* The Hidden Actual Input */}
          <input 
            type="file" 
            id="file-upload"
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          /> 

          {/* The Styled "Fake" Button */}
          <label 
            htmlFor="file-upload" 
            style={styles.customUploadBtn}
          >
            Upload Image
          </label>
          <label style={{ fontWeight: 'bold' }}>{fileName}</label>
        
        </div>

      {/* Group 2: K-Value */}
      <div style={styles.inputGroup}>
        <label style={{ fontWeight: 'bold' }}>K Value:</label>
        <input type="number" value={kValue} onChange={e => setKValue(Number(e.target.value))} style={styles.inputStyle} />
      </div>

      {/* Action Button */}
      <button 
        onClick={() => runKMeans(setIsProcessing, mainCanvasRef, image, kValue, results, setResults)} 
        disabled={!image || isProcessing} 
        style={{...styles.primaryBtnStyle, minWidth: '250px'}}
      >
        Analyze & Generate
      </button>
    </div>



     {/* --- POST-CONTROL SUMMARY SECTION --- */}
        {results.segments.length > 0 && (
          <div style={{ marginTop: '0px', marginBottom: '30px' }}>
            
            {/* Row 1: Convergence Info */}
            <div style={{ marginBottom: '15px' }}>
              <span style={{ 
                backgroundColor: '#e8f5e9', 
                color: '#2e7d32', 
                padding: '6px 20px', 
                borderRadius: '20px', 
                fontWeight: 'bold',
                fontSize: '0.95em'
              }}>
                Converged in {results.iterations} iterations
              </span>
            </div>

            {/* Row 2: Color Palette Legend */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexWrap: 'wrap', 
              gap: '10px', 
              maxWidth: '800px', 
              margin: '0 auto' 
            }}>
              {results.colors.map((color, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'white',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  border: '1px solid #eee'
                }}>
                  {/* Color Preview Circle */}
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                    marginRight: '10px',
                    border: '1px solid #ddd'
                  }}></div>
                  
                  {/* RGB Text */}
                  <span style={{ fontSize: '0.85em', fontWeight: '500', color: '#444' }}>
                    K-{i + 1}: <span style={{ color: '#888' }}>({color.r}, {color.g}, {color.b})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
 



     {/* Showing original and simplified images */}

     <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
        {image && (
          <div style={styles.mainCard}>
            <h4 style={styles.cardTitle}>Original</h4>
            <img src={image} style={{ maxWidth: '400px', borderRadius: '4px' }} alt="Original" />
          </div>
        )}
        <div style={{ ...styles.mainCard, display: results.segments.length > 0 ? 'block' : 'none' }}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <h4 style={styles.cardTitle}>Simplified K-Colors</h4>
             
            </div>
          <canvas ref={mainCanvasRef} style={{ maxWidth: '400px', borderRadius: '4px' }} />

           {/* <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center',marginTop: '10px'}}>
               
               

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              {results.colors.map((color, i) => 
              
              <div key={i} style={{display: 'flex', flexDirection:"column", alignItems: 'center', paddingLeft:"24px", paddingRight:"24px"}
                }>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '20px'}}>
              
              <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>K-{i+1} </div>
              
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: `rgb(${color.r},${color.g},${color.b})`, marginTop: '8px', borderRadius: '2px' }}></div>
              </div>
              
              )}
              
            
            </div>

                <button onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'simplified-kmeans.png';
                    link.href = mainCanvasRef.current.toDataURL();
                    link.click();
                }} style={styles.iconBtnStyle}><DownloadIcon fontSize="small" />
              </button>
            </div>     */}

           {results.segments.length > 0 && (
          <div style={{ marginTop: '10px', flexDirection: 'row', display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '10px'}}>
                     
            {/* Row 2: Color Palette Legend */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              flexDirection: 'column',
              flexWrap: 'wrap', 
              gap: '10px', 
              maxWidth: '800px', 
              //margin: '0 auto' 
            }}>
              {results.colors.map((color, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'white',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  border: '1px solid #eee'
                }}>
                  {/* Color Preview Circle */}
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                    marginRight: '10px',
                    border: '1px solid #ddd'
                  }}></div>
                  
                  {/* RGB Text */}
                  <span style={{ fontSize: '0.85em', fontWeight: '500', color: '#444' }}>
                    K-{i + 1}: <span style={{ color: '#888' }}>({color.r}, {color.g}, {color.b})</span>
                  </span>
                </div>
              ))}
            </div>

                <button onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'simplified-kmeans.png';
                    link.href = mainCanvasRef.current.toDataURL();
                    link.click();
                }} style={styles.iconBtnStyle}><DownloadIcon fontSize="small" />
              </button>


          </div>
        )}  


        </div>
     </div>
                


      {/* Showing Segments      */}
     {results.segments.length > 0 && (
        <div>
          
          <h3 style={{ marginBottom: '20px' }}>Generated Color Clusters</h3>
          
          {/* K-valued SEGMENT CARDS */}

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {/* {results.segments.map((seg, i) => (
              <SegmentCard key={i} imageData={seg} color={results.colors[i]} label={`Cluster ${i+1}`} onClick={() => setSelectedIdx(i)} />
            ))} */}
            {results.segments.map((seg, i) => (
              <SegmentCard 
                key={`simple-${i}`} 
                imageData={seg} 
                color={results.colors[i]} 
                onClick={() => setSelectedItem({ index: i, type: 'simple' })} 
              />
             ))}
          </div>
       

          {/* --- ORIGINAL COLOR SEGMENTS Cards --- */}
          {results.originalSegments?.length > 0 && (
           <div >
                <hr style={{ border: '0.5px solid #eee', width: '80%', margin: '40px auto' }} />
                <h3 style={{ marginBottom: '10px' }}>Natural Color Segmentation</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>Clusters using original pixel colors with transparency</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
               
                  {results.originalSegments.map((seg, i) => (
              <SegmentCard 
                key={`natural-${i}`} 
                imageData={seg} 
                color={results.colors[i]} 
                onClick={() => setSelectedItem({ index: i, type: 'natural' })} 
              />
            ))}
                </div>
           </div>
            )}

          {/* --- Subtraction Cards --- */}
          {results.segments.length > 0 && (
            <div style={{ marginTop: '50px', paddingBottom: '50px' }}>
              <hr style={{ border: '0.5px solid #eee', width: '80%', margin: '40px auto' }} />
              <h2 style={{ color: '#1976d2' }}>Color Subtraction Tool</h2>
              <p>Select a cluster to remove it from the original image</p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {results.colors.map((color, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSubtraction(i)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                      border: subtractedIndex === i ? '4px solid #333' : '2px solid #ddd',
                      cursor: 'pointer'
                    }}
                    title={`Subtract Cluster ${i+1}`}
                  />
                ))}
              </div>

              {subtractionResult && (
                <div style={styles.mainCard}>
                  <h3>Subtraction Result</h3>
                  <SubtractionCanvas imageData={subtractionResult} />
                  <button onClick={downloadSubtraction} style={{...styles.iconBtnStyle, marginTop: '10px'}}>
                    <DownloadIcon />
                  </button>
                </div>
              )}
            </div>
          )}


          {/* SAVE ALL BUTTON */}
          
          <button onClick={()=>downloadAllAsZip(image, results, mainCanvasRef, subtractionResult,subtractedIndex)} style={styles.saveAllBtnStyle}>
            <DownloadIcon style={{marginRight: '10px'}} /> Save Project (ZIP)
          </button>

        </div>
      )}



      {/* showing Modal */}
      {selectedItem !== null && (
        <FullscreenModal 
          imageData={
            selectedItem.type === 'simple' 
            ? results.segments[selectedItem.index] 
            : results.originalSegments[selectedItem.index]
          } 
          color={results.colors[selectedItem.index]} 
          onClose={() => setSelectedItem(null)} 
        />
      )}


   
     
    </div>











{/* --- DOCUMENTATION SECTIONS --- */}
<div style={{ marginTop: '80px', textAlign: 'left', maxWidth: '800px', margin: '80px auto 0 auto', padding: '0 20px' }}>
  


  {/* <section id="about" style={{ paddingBottom: '100px' }}>
    <h2 style={{ color: '#1976d2', borderBottom: '2px solid #1976d2', paddingBottom: '10px' }}>About Us</h2>
    <p>
      This K-Means Tool was built to demonstrate the power of unsupervised machine learning in image processing. 
      By clustering pixel data, we can effectively compress images and extract dominant color palettes automatically.
    </p>
    <p style={{ color: '#666', fontStyle: 'italic' }}>Developed as an educational tool by Ubaid ur Rehman - MSCS student @ IST Islamabad Pakistan.</p>
  </section> */}

</div>

<footer style={{ marginTop: '100px', padding: '40px', borderTop: '1px solid #ddd', color: '#888' }}>
  <p> K-Means Educational Tool. Developed by Ubaid ur Rehman - MSCS student @ IST Islamabad Pakistan..</p>
  <p>
    Enjoyed this tool? <a href="https://github.com/askubaid/K-means" target="https://github.com/askubaid/K-means" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>Give it a ⭐ on GitHub</a>
  </p>
</footer>

    </div>
  );
}

