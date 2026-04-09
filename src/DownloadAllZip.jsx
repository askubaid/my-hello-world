// import JSZip from 'jszip'; // Import JSZip


// const downloadAllAsZip = async (image, results, mainCanvasRef) => {
//     const zip = new JSZip();
//     const folder = zip.folder("K-Means-Export");

//     // 1. Original Image (Convert base64 to blob)
//     const originalBlob = await fetch(image).then(r => r.blob());
//     folder.file("01-original-image.png", originalBlob);

//     // 2. Simplified Image
//     const simplifiedData = mainCanvasRef.current.toDataURL("image/png").split(',')[1];
//     folder.file("02-simplified-output.png", simplifiedData, {base64: true});

//     // 3. Individual Segments
//     results.segments.forEach((seg, i) => {
//       const tempCanvas = document.createElement('canvas');
//       tempCanvas.width = seg.width;
//       tempCanvas.height = seg.height;
//       tempCanvas.getContext('2d').putImageData(seg, 0, 0);
//       const data = tempCanvas.toDataURL("image/png").split(',')[1];
//       folder.file(`cluster-${i+1}-rgb(${results.colors[i].r},${results.colors[i].g},${results.colors[i].b}).png`, data, {base64: true});
//     });

//     const content = await zip.generateAsync({type: "blob"});
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(content);
//     link.download = "kmeans-project-export.zip";
//     link.click();
//   };

//   export default downloadAllAsZip;


///////////////////////

// import JSZip from 'jszip';

// const downloadAllAsZip = async (image, results, mainCanvasRef,subtractionResult,subtractedIndex) => {
//   const zip = new JSZip();
//   const root = zip.folder("K-Means-Project");

//   // 1. Original Image
//   const originalBlob = await fetch(image).then(r => r.blob());
//   root.file("01-Original-Image.png", originalBlob);

//   // 2. Simplified (Main) Result
//   const simplifiedData = mainCanvasRef.current.toDataURL("image/png").split(',')[1];
//   root.file("02-Simplified-K-Colors.png", simplifiedData, { base64: true });

//   // 3. Folder: Centroid Clusters (Simplified)
//   const centroidFolder = root.folder("Simplified-Clusters");
//   results.segments.forEach((seg, i) => {
//     const canvas = document.createElement('canvas');
//     canvas.width = seg.width;
//     canvas.height = seg.height;
//     canvas.getContext('2d').putImageData(seg, 0, 0);
//     const data = canvas.toDataURL("image/png").split(',')[1];
//     centroidFolder.file(`cluster-${i + 1}-simplified.png`, data, { base64: true });
//   });

//   // 4. Folder: Natural Clusters (Original colors + transparency)
//   const naturalFolder = root.folder("Natural-Clusters");
//   results.originalSegments.forEach((seg, i) => {
//     const canvas = document.createElement('canvas');
//     canvas.width = seg.width;
//     canvas.height = seg.height;
//     canvas.getContext('2d').putImageData(seg, 0, 0);
//     const data = canvas.toDataURL("image/png").split(',')[1];
//     naturalFolder.file(`cluster-${i + 1}-natural.png`, data, { base64: true });
//   });

//   // 5. Folder: Subtraction Results
//  if (subtractionResult) {
//   const subFolder = root.folder("Subtraction-Result");
//   const canvas = document.createElement('canvas');
//   canvas.width = subtractionResult.width;
//   canvas.height = subtractionResult.height;
//   canvas.getContext('2d').putImageData(subtractionResult, 0, 0);
//   const data = canvas.toDataURL("image/png").split(',');
//   subFolder.file(`subtracted-cluster-${subtractedIndex + 1}.png`, data, { base64: true });
//   }


//   // Generate and Trigger Download
//   const content = await zip.generateAsync({ type: "blob" });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(content);
//   link.download = `kmeans-full-export-k${results.colors.length}.zip`;
//   link.click();
// };

// export default downloadAllAsZip;


import JSZip from 'jszip';

const downloadAllAsZip = async (image, results, mainCanvasRef, subtractionResult, subtractedIndex) => {
  const zip = new JSZip();
  const root = zip.folder("K-Means-Project");

  // 1. Original Image
  const originalBlob = await fetch(image).then(r => r.blob());
  root.file("01-Original-Image.png", originalBlob);

  // 2. Simplified (Main) Result
  const simplifiedData = mainCanvasRef.current.toDataURL("image/png").split(',')[1];
  root.file("02-Simplified-K-Colors.png", simplifiedData, { base64: true });

  // 3. Folder: Centroid Clusters (Simplified)
  const centroidFolder = root.folder("Simplified-Clusters");
  results.segments.forEach((seg, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = seg.width;
    canvas.height = seg.height;
    canvas.getContext('2d').putImageData(seg, 0, 0);
    const data = canvas.toDataURL("image/png").split(',')[1];
    centroidFolder.file(`cluster-${i + 1}-simplified.png`, data, { base64: true });
  });

  // 4. Folder: Natural Clusters (Original colors + transparency)
  const naturalFolder = root.folder("Natural-Clusters");
  results.originalSegments.forEach((seg, i) => {
    const canvas = document.createElement('canvas');
    canvas.width = seg.width;
    canvas.height = seg.height;
    canvas.getContext('2d').putImageData(seg, 0, 0);
    const data = canvas.toDataURL("image/png").split(',')[1];
    naturalFolder.file(`cluster-${i + 1}-natural.png`, data, { base64: true });
  });

  // 5. ADDED: Subtraction Result Fix
  if (subtractionResult) {
    const subFolder = root.folder("Subtraction-Result");
    const canvas = document.createElement('canvas');
    canvas.width = subtractionResult.width;
    canvas.height = subtractionResult.height;
    // We MUST put the ImageData onto a canvas to get a valid DataURL
    canvas.getContext('2d').putImageData(subtractionResult, 0, 0);
    
    // Split to get only the base64 string after 'base64,'
    const data = canvas.toDataURL("image/png").split(',')[1];
    if (data) {
      subFolder.file(`subtracted-cluster-${subtractedIndex + 1}.png`, data, { base64: true });
    }
  }

  // Generate and Trigger Download
  const content = await zip.generateAsync({ type: "blob" });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `kmeans-full-export-k${results.colors.length}.zip`;
  link.click();
};

export default downloadAllAsZip;
