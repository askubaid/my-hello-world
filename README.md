# K-Means Image Visualization

An interactive tool that uses the K-Means clustering algorithm to perform color segmentation on images. This K-Means Tool was built to demonstrate the power of unsupervised machine learning in image processing, By clustering pixel data, we can effectively extract dominant color palettes automatically.


## 🚀 Live Demo
Tool Demonstration is here: https://askubaid.github.io/K-means/

## 📖 About the Algorithm

K-Means clustering is a machine learning method used to group data points. In this app, each pixel's RGB value is a data point.
The algorithm:
- **1:** Picks random colors.
- **2:** Assigns every pixel to the nearest of those colors.
- **3:** Calculates the average color of each group and moves the colors to that average.
- **4:** Repeats until the colors stop changing (Convergence)


## 🛠️ Features
- **Real-time Clustering**: Processes pixels until centroids converge.
- **Transparency Support**: Individual clusters are exported with transparent backgrounds.
- **ZIP Export**: Download all color segments, the original, and the simplified image in one click.
- **Mobile Responsive**: Fully functional on mobile and desktop browsers.

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

