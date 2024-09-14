from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
import uuid
import cv2
from .exposure_enhancement import enhance_image_exposure
import numpy as np

app = Flask(__name__)
CORS(app, origins=["https://image-enhancement-six.vercel.app"])

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Read the file into memory
        in_memory_file = io.BytesIO(file.read())
        
        # Convert the in-memory file to a NumPy array
        file_bytes = np.asarray(bytearray(in_memory_file.read()), dtype=np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        # Enhance the image
        enhanced_image = enhance_image_exposure(image, 0.6, 0.15, True, sigma=3, bc=1, bs=1, be=1, eps=1e-3)

        # Convert the enhanced image to an in-memory file
        _, buffer = cv2.imencode('.jpg', enhanced_image)
        enhanced_image_bytes = io.BytesIO(buffer)

        # Return the enhanced image
        return send_file(enhanced_image_bytes, mimetype='image/jpeg', as_attachment=True, download_name='enhanced_image.jpg')

if __name__ == '__main__':
    app.run()
