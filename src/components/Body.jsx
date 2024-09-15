import { React, useState } from "react";
import axios from "axios";

const RENDER_URL = "https://imageenhancement.onrender.com";

function Body() {
  const [file, setFile] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setEnhancedImage(null);
    setDownloadUrl(null);
  }

  async function handleEnhance() {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${RENDER_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      const url = URL.createObjectURL(new Blob([response.data]));
      setEnhancedImage(url);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error uploading file", error);
      alert("An error occurred while processing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="body-content">
      <h1>Low Light Image Enhancement</h1>
      <div className="content">
        <h3>Upload your Image</h3>
        <input type="file" onChange={handleFileChange} />
        <div className="image-container">
          {file && (
            <div className="image-wrapper">
              <h4>Uploaded Image</h4>
              <img
                src={URL.createObjectURL(file)}
                alt="Image uploaded by user"
              />
            </div>
          )}
          {enhancedImage && (
            <div className="image-wrapper">
              <h4>Enhanced Image</h4>
              <img src={enhancedImage} alt="Enhanced image" />
            </div>
          )}
        </div>
        <button onClick={handleEnhance} disabled={loading}>
          {loading ? "Processing..." : "Enhance"}
        </button>

        {downloadUrl && (
          <div>
            <a href={downloadUrl} download="enhanced_image.jpg" className="btn">
              Download Enhanced Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Body;
