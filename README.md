# K-Means Image Visualization

An interactive tool that uses the K-Means clustering algorithm to perform color segmentation on images. This tool demonstrates the power of unsupervised machine learning in image processing by effectively extracting dominant color palettes and isolating image segments.

## 🚀 Live Demo
**Try the tool here:** [https://askubaid.github.io/K-means/](https://askubaid.github.io/K-means/)

## 🛠️ Key Features
- **Real-time Clustering**: Iterative processing until mathematical convergence.
- **Natural Color Isolation**: Extract clusters using their original textures and shading with transparent backgrounds.
- **Multi-Color Subtraction**: Toggle multiple color clusters to "punch holes" in the original image (Automatic background/object removal).
- **Interactive UI**: Fullscreen modal previews with checkerboard transparency support.
- **Bulk Export**: Download a structured ZIP file containing the original image, simplified output, and all isolated segments.
- **Fully Responsive**: Optimized for both desktop and mobile devices.

## 🧪 How the Algorithm Works
Each pixel's RGB value is treated as a data point in 3D space. The algorithm:
1. **Initialize**: Picks $K$ random colors (centroids).
2. **Assign**: Assigns every pixel to its nearest centroid.
3. **Update**: Calculates the average color of each group and moves the centroid to that average.
4. **Converge**: Repeats until the colors stabilize.

## 🧰 Tech Stack

- **React.js (Vite)**
- **Material UI (Icons)**
- **JSZip (Project Export)**
- **HTML5 Canvas API (Image Processing)**


## 💻 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/askubaid/K-means.git
   cd K-means
     
2. **Install Dependencies**
   ```bash
   npm install

3. **Run the App**
   ```bash
   npm run dev



