import os
import sys
# Add the parent directory to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.rekognition_utils import compare_faces

# Define the S3 object keys for the source and target images
source_image = 'ref-raj.jpg'  # Replace with the actual S3 object key
target_image = 'raj.jpg'  # Replace with the actual S3 object key

matches = compare_faces(source_image, target_image)
if matches:
    print("Faces matched!")
    for match in matches:
        print(f"Similarity: {match['Similarity']}%")
else:
    print("No matches found.")
